import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    AfterViewInit,
    OnDestroy,
} from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { isAndroid } from "@nativescript/core";

// Avoid TS module-typing issues with @nstudio/nativescript-exoplayer
const { Video } = require("@nstudio/nativescript-exoplayer");

registerElement("Video", () => Video);

// Creates a ViewOutlineProvider without @NativeClass()
// Uses .extend() at runtime, cast to any to satisfy TS typings
function createRoundedOutlineProvider(radius: number) {
    const Provider = (android.view.ViewOutlineProvider as any).extend({
        getOutline(view: android.view.View, outline: android.graphics.Outline) {
            const w = Math.max(1, view.getWidth());
            const h = Math.max(1, view.getHeight());
            outline.setRoundRect(0, 0, w, h, radius);
        },
    });

    return new Provider();
}

@Component({
    selector: "SymVideoPlayer",
    templateUrl: "./video-player.component.html",
    styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
    @Input() src: string = "";
    @Input() height: number = 200;

    @ViewChild("wrapper", { static: false }) wrapper: ElementRef;
    @ViewChild("player", { static: false }) player: ElementRef;

    ngOnDestroy() {
        if (this.player?.nativeElement) {
            try {
                this.player.nativeElement.release();
            } catch {
                // swallow
            }
        }
    }

    ngAfterViewInit(): void {
        if (isAndroid && this.player?.nativeElement?.android) {
            const nativeView = this.player.nativeElement.android;

            if (android.os.Build.VERSION.SDK_INT >= 21) {
                const radius =
                    12 * nativeView.getResources().getDisplayMetrics().density;

                nativeView.setClipToOutline(true);
                nativeView.setOutlineProvider(
                    createRoundedOutlineProvider(radius),
                );
                nativeView.invalidateOutline();

                const parent = nativeView.getParent();
                if (parent instanceof android.view.ViewGroup) {
                    parent.setClipToOutline(true);
                    parent.setOutlineProvider(
                        createRoundedOutlineProvider(radius),
                    );
                    parent.invalidateOutline();
                }
            }
        }
    }
}
