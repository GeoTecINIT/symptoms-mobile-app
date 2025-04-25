import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    AfterViewInit,
    OnDestroy,
} from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { Video } from "@nstudio/nativescript-exoplayer";

import { isAndroid } from "@nativescript/core";

registerElement("Video", () => Video);

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
            } catch (error) {
                // swallow
            }
        }
    }

    ngAfterViewInit(): void {
        if (isAndroid && this.player?.nativeElement?.android) {
            const nativeView = this.player.nativeElement.android;

            // For Android Lollipop+:
            if (android.os.Build.VERSION.SDK_INT >= 21) {
                const radius =
                    12 * nativeView.getResources().getDisplayMetrics().density;

                // Clip the Video view itself:
                nativeView.setClipToOutline(true);
                nativeView.setOutlineProvider(
                    new RoundedOutlineProvider(radius)
                );
                nativeView.invalidateOutline();

                // ...and optionally clip the parent:
                const parent = nativeView.getParent();
                if (parent instanceof android.view.ViewGroup) {
                    parent.setClipToOutline(true);
                    parent.setOutlineProvider(
                        new RoundedOutlineProvider(radius)
                    );
                    parent.invalidateOutline();
                }
            }
        }
    }
}

@NativeClass()
class RoundedOutlineProvider extends android.view.ViewOutlineProvider {
    constructor(private radius: number) {
        super();
    }
    getOutline(view: android.view.View, outline: android.graphics.Outline) {
        outline.setRoundRect(
            0,
            0,
            view.getWidth(),
            view.getHeight(),
            this.radius
        );
    }
}
