import { Component, Input, Output, NgZone, OnInit } from "@angular/core";
import {
    AudioPlayerOptions,
    AudioRecorderOptions,
    TNSPlayer,
    TNSRecorder,
} from "nativescript-audio";

import {
    Folder,
    knownFolders,
    File,
    path,
} from "@nativescript/core/file-system";

import { storage } from "@nativescript/firebase/storage";

import { Slider } from "@nativescript/core";

@Component({
    selector: "SymAudioPlayerRecorder",
    templateUrl: "./audio-player-recorder.component.html",
    styleUrls: ["./audio-player-recorder.component.scss"],
})
export class AudioPlayerRecorderComponent implements OnInit {
    @Input() public isStoredLocally: boolean;
    @Output() public audioUrl: string;
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
            channels: 1,
            sampleRate: 44100,
            bitRate: 128000,
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

    async stopRecording() {
        await this.audioRecorder.stop();
        this.isRecording = false;
        this.timerDisplay = "00:00";
        this.uploadAudioRecording(this.recordedAudioFile);
    }

    async uploadAudioRecording(audioFilePath: string) {
        console.log("\n\nEntered upload audio recording \n\n");
        const remoteFullPath = `audios/${audioFilePath.split("/").pop()}`;
        storage
            .uploadFile({
                bucket: "", // optional
                remoteFullPath: remoteFullPath,
                // localFile: audioFilePath,
                localFullPath: audioFilePath,
                onProgress: function (status) {
                    console.log(
                        "Uploaded fraction: " + status.fractionCompleted
                    );
                    console.log(
                        "Percentage complete: " + status.percentageCompleted
                    );
                },
                metadata: {
                    contentType: "demo/test/audios",
                    contentLanguage: "es",
                    customMetadata: {},
                },
            })
            .then(
                function (uploadedFile) {
                    console.log("asoidmasoida");
                    this.obtainAudioUrl(remoteFullPath);
                    console.log(
                        "File uploaded: " + JSON.stringify(uploadedFile)
                    );
                }.bind(this),
                function (error) {
                    console.log("File upload error: " + error);
                }
            );
    }

    async obtainAudioUrl(remoteFullPath: string): Promise<string> {
        console.log("\n\nEntered obtain audio url \n\n");
        try {
            const url = await storage.getDownloadUrl({
                remoteFullPath: remoteFullPath,
            });
            console.log("Remote URL: " + url);
            return url;
        } catch (error) {
            console.log("Error: " + error);
            throw new Error("Failed to obtain audio URL");
        }
    }

    async storeLocally(audioFilePath: string) {
        const localFolder = knownFolders.documents().getFolder("recordings");
        const file = File.fromPath(audioFilePath);

        try {
            const destinationPath = path.join(localFolder.path, file.name);
            const binaryContent = file.readSync((error) => {
                console.error("Error reading file: ", error);
            });
            const destinationFile = File.fromPath(destinationPath);
            destinationFile.writeSync(binaryContent, (error) => {
                console.error("Error writing file: ", error);
            });
        } catch (error) {
            console.error("Error copying file: ", error);
        }
    }

    playRecording(): void {
        if (this.recordedAudioFile) {
            console.log("Recorded audio file info: " + this.recordedAudioFile);
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
