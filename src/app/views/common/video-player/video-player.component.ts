import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    AfterContentInit,
} from "@angular/core";

import { registerElement } from "@nativescript/angular";
import { Video } from "@nstudio/nativescript-exoplayer";
registerElement("Video", () => Video);

@Component({
    selector: "SymVideoPlayer",
    templateUrl: "./video-player.component.html",
    styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements OnDestroy {
    @Input() src: string = "";
    @Input() height: number = 300;

    @ViewChild("player") private player: ElementRef;

    ngOnDestroy() {
        if (this.player && this.player.nativeElement) {
            try {
                this.player.nativeElement.release();
            } catch (error) {}
        }
    }
}
