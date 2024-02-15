import { Component, NgZone, OnInit } from "@angular/core";
import {
    AudioPlayerOptions,
    AudioRecorderOptions,
    TNSPlayer,
    TNSRecorder,
} from "nativescript-audio";

import { Folder, knownFolders } from "@nativescript/core/file-system";
import { Slider } from "@nativescript/core";

@Component({
    selector: "SymAudioPlayerRecorder",
    templateUrl: "./audio-player-recorder.component.html",
    styleUrls: ["./audio-player-recorder.component.scss"],
})
export class AudioPlayerRecorderComponent implements OnInit {
    public audioRecorder: TNSRecorder;
    public audioPlayer: TNSPlayer;
    public recordedAudioFile: string;
    public isRecording: boolean = false;
    public isPlaying: boolean = false;
    public wasPaused: boolean = false;
    public totalDuration: number = 0;
    public currentPlaybackPosition: number = 0;
    public playbackInterval: any;
    public timerDisplay: string = "00:00:00";

    constructor(private zone: NgZone) {
        this.audioRecorder = new TNSRecorder();
        this.audioRecorder.debug = true;
        this.audioPlayer = new TNSPlayer();
    }

    ngOnInit(): void {}

    manageRecording() {
        if (!this.isRecording) {
            this.startRecording();
            this.currentPlaybackPosition = 0;
        } else this.stopRecording();
    }

    async startRecording() {
        if (this.isPlaying) {
            this.pausePlayback();
        }
        if (!TNSRecorder.CAN_RECORD()) return;

        // Setting up folder and recording options
        const audioFolder: Folder = knownFolders
            .currentApp()
            .getFolder("audio");

        const audioRecorderOptions: AudioRecorderOptions = {
            filename: `${
                audioFolder.path
            }/recording_${new Date().getTime()}.m4a`,
            // working formats: 0, 1, *2, *6, 8
            // 2: https://developer.android.com/reference/android/media/AudioFormat#ENCODING_PCM_16BIT, most stable/guaranteed to work
            // 6: https://developer.android.com/reference/android/media/AudioFormat#ENCODING_E_AC3, best quality and quite stable as well
            format: 2,
            // working encoders: 0, 1, 2, *3,
            // 3: https://developer.android.com/reference/android/media/MediaRecorder.AudioEncoder#AAC, most stable and commonly used
            encoder: 3,
            metering: true,
            infoCallback: (infoObject) => {
                console.log(JSON.stringify(infoObject));
            },
            errorCallback: (errorObject) => {
                console.log(JSON.stringify(errorObject));
            },
        };

        try {
            await this.audioRecorder.start(audioRecorderOptions);
            this.recordedAudioFile = audioRecorderOptions.filename;
            this.isRecording = true;
            this.wasPaused = false;
        } catch (err) {
            console.error(err);
        }
    }

    stopRecording(): void {
        this.audioRecorder.stop().then(() => {
            this.isRecording = false;
            this.timerDisplay = "00:00";
        });
    }

    playRecording(): void {
        if (this.recordedAudioFile) {
            const playerOptions: AudioPlayerOptions = {
                audioFile: this.recordedAudioFile,
                loop: false,
                completeCallback: () => {
                    this.zone.run(() => {
                        this.isPlaying = false;
                        this.wasPaused = false;
                        console.log("Audio file has finished playing");
                    });
                },
            };

            // TODO: might need to update if firebase logistic is added
            this.audioPlayer.playFromFile(playerOptions).then(
                () => {
                    this.zone.run(() => {
                        this.isPlaying = true;
                        this.wasPaused = false;
                        console.log("Audio file is being played");
                    });

                    this.audioPlayer
                        .getAudioTrackDuration()
                        .then((duration: any) => {
                            this.totalDuration = parseFloat(duration);
                            this.timerDisplay = this.formatTime(
                                this.totalDuration / 1000
                            );
                            console.log(
                                `Total duration: ${this.totalDuration}`
                            );
                            this.startOrUpdatePlaybackInterval();
                        });
                },
                (err) => {
                    console.error("Error playing file", err);
                }
            );
        }
    }

    pausePlayback(): void {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.wasPaused = true;

            if (this.playbackInterval) {
                clearInterval(this.playbackInterval);
            }
        }
    }

    resumePlayback(): void {
        if (!this.isPlaying && this.recordedAudioFile && this.wasPaused) {
            this.audioPlayer.resume();
            this.isPlaying = true;
            this.wasPaused = false;

            this.startOrUpdatePlaybackInterval();
        }
    }

    managePlayback(): void {
        if (this.recordedAudioFile) {
            if (!this.isPlaying && !this.wasPaused) {
                this.playRecording();
            } else if (this.isPlaying) {
                this.pausePlayback();
            } else if (!this.isPlaying && this.wasPaused) {
                this.resumePlayback();
            }
        }
    }

    startOrUpdatePlaybackInterval() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
        }

        this.playbackInterval = setInterval(() => {
            if (!this.isPlaying || !this.audioPlayer.isAudioPlaying()) {
                clearInterval(this.playbackInterval);
            } else {
                let currentTime = this.audioPlayer.currentTime;
                this.zone.run(() => {
                    this.currentPlaybackPosition =
                        (currentTime / this.totalDuration) * 100;
                    this.timerDisplay = this.formatTime(currentTime / 1000);
                });
            }
        }, 5);
    }

    private formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        let formattedTime = `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
        if (hours > 0) {
            formattedTime = `${hours
                .toString()
                .padStart(2, "0")}:${formattedTime}`;
        }

        return formattedTime;
    }

    onSliderValueChange(event: any): void {
        if (!this.isRecording && this.recordedAudioFile) {
            const slider = event.object as Slider;
            const newValue = slider.value;

            if (Math.abs(newValue - this.currentPlaybackPosition) > 1) {
                const seekTime = (newValue / 100) * this.totalDuration;
                this.audioPlayer.seekTo(seekTime / 1000).then(
                    () => {
                        this.currentPlaybackPosition = newValue;

                        if (this.wasPaused) {
                            let currentTime = this.audioPlayer.currentTime;
                            this.timerDisplay = this.formatTime(
                                currentTime / 1000
                            );
                        }
                    },
                    (err) => {
                        console.error("Error while seeking in audio", err);
                    }
                );
            }
        }
    }
}
