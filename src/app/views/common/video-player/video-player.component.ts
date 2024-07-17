import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";

import { registerElement } from "@nativescript/angular";
import { Video } from '@nstudio/nativescript-exoplayer';
registerElement("Video", () => Video);

@Component({
    selector: "SymVideoPlayer",
    templateUrl: "./video-player.component.html",
    styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
    @Input() src: string = '';
    @Input() height: number = 300;

    @ViewChild("player") private player: ElementRef;

    // The default thumbnail in ExoPlayer is a black screen. As there is no method for setting a thumbnail, I've come up with this workaround. 
    ngAfterViewInit() {        
        if (!this.player) return;
        console.log("Playback ready❗❗❗");
        
        const playerElement: Video = this.player.nativeElement;
        playerElement.seekToTime(50);
        playerElement.play();
        // playerElement.pause();

        // playerElement.seekToTime(1000);
        // playerElement.pause();
    }

    ngOnDestroy() {
        if (!!this.player) this.player.nativeElement.destroy();
    }
}
