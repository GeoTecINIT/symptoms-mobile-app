import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output } from "@angular/core";
import { EventData, Folder, knownFolders, Slider, TextField, File } from "@nativescript/core";

import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from "nativescript-audio";

type ReturnKeyType = "done" | "next" | "go" | "search" | "send";

@Component({
    selector: "SymTextAndAudioInput",
    templateUrl: "./text-and-audio-input.component.html",
    styleUrls: ["./text-and-audio-input.component.scss"],
})
export class TextAndAudioInputComponent {
    // Text input related Input and Output
    @Input() text = "";
    @Input() returnKeyType: ReturnKeyType = "done";
    @Input() hint = "";
    @Input() helpText = "";

    @Output() textChanged = new EventEmitter<string>();
    @Output() returnKeyPressed = new EventEmitter<void>();

    // Audio recorder related Output
    @Output() audioRecorded = new EventEmitter<string>();

    constructor(private zone: NgZone, private cdr: ChangeDetectorRef) { }

    audioRecorder: TNSRecorder = new TNSRecorder();
    audioPlayer: TNSPlayer = new TNSPlayer();

    // Icon Unicode constants
    playIcon = "\ue037";
    pauseIcon = "\ue034";
    stopIcon = "\ue047";
    recordIcon = "\ue029";
    deleteIcon = "\ue872";

    // Text field variables
    focus: boolean = false;

    // Audio variables
    // -> Audio file 
    recordedAudioFilePath: string = '';
    totalDuration: number = 0; // In seconds

    // -> Recording state
    isRecording: boolean = false;

    // -> Playback state 
    playbackIntervalId;
    isPlaying: boolean = false;
    currentTime: number = 0; // In seconds
    currentPlaybackPosition: number = 0;

    ngOnDestroy() {
        if (this.playbackIntervalId) {
            clearInterval(this.playbackIntervalId);
        }
    }

    /*
    * Text field functions
    */

    onFieldFocus() {
        this.focus = true;
    }

    onFieldBlur() {
        this.focus = false;
    }

    onReturnPressed() {
        this.returnKeyPressed.emit();
    }

    onFieldTextChange(args: EventData) {
        const textField = args.object as TextField;
        this.textChanged.emit(textField.text);
    }

    /*
    * Audio recording functions
    */

    // -> Recording related functions

    manageRecording() {
        if (!this.isRecording) {
            this.startRecording();
            this.currentPlaybackPosition = 0;
        } else this.stopRecording();
    }

    async startRecording() {
        if (!TNSRecorder.CAN_RECORD()) return;

        // Setting up folder and recording options
        const audioFolder: Folder = knownFolders
            .currentApp()
            .getFolder("audio");

        const audioRecorderOptions: AudioRecorderOptions = {
            filename: `${audioFolder.path
                }/recording_EXPOSURE_ID_${new Date().getTime()}.mp3`,
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
            bitRate: 32000,
            maxDuration: 120000,
            // TODO: Use proper logs
            infoCallback: (infoObject) => {
                console.log(JSON.stringify(infoObject));
            },
            errorCallback: (errorObject) => {
                console.log(JSON.stringify(errorObject));
            },
        };

        try {
            await this.audioRecorder.start(audioRecorderOptions);
            this.zone.run(() => {
                this.recordedAudioFilePath = audioRecorderOptions.filename;
                this.isRecording = true;
            });
        } catch (err) {
            console.error(err);
        }
    }

    async stopRecording() {
        await this.audioRecorder.stop();
        this.isRecording = false;

        this.audioRecorded.emit(this.recordedAudioFilePath);

        // Init audio player with recorded audio
        const playerOptions: AudioPlayerOptions = {
            audioFile: this.recordedAudioFilePath,
            loop: false,
            completeCallback: () => {
                this.zone.run(() => {
                    this.isPlaying = false;
                    clearInterval(this.playbackIntervalId);
                });
            }
        }

        await this.audioPlayer.initFromFile(playerOptions);
        this.totalDuration = parseFloat(await this.audioPlayer.getAudioTrackDuration()) / 1000;
    }

    async deleteRecording() {
        const audioFile = File.fromPath(this.recordedAudioFilePath);
        audioFile.removeSync();

        await this.audioRecorder.dispose();
        this.recordedAudioFilePath = '';
        this.currentTime = 0; 
        this.audioRecorded.emit('');   
    }

    // -> Playback related functions

    managePlayback(): void {
        if (!this.recordedAudioFilePath) return;

        if (this.isPlaying) this.pausePlayback();
        else this.playRecording();
    }

    async playRecording() {
        if (!this.recordedAudioFilePath) return;

        console.log("this.currentTime:", this.currentTime)

        if (this.currentTime !== 0) this.audioPlayer.resume();
        else await this.audioPlayer.play();

        // Using ngZone because of NG0100 error
        this.zone.run(() => {
            this.isPlaying = true;
        });
    
        this.playbackIntervalId = setInterval(() => {
            this.zone.run(() => {
                this.currentTime = this.audioPlayer.currentTime / 1000;
                this.currentPlaybackPosition = (this.currentTime / this.totalDuration) * 100;
            })
        }, 50);
    }

    async pausePlayback() {
        if (!this.isPlaying) return;

        await this.audioPlayer.pause();
        this.isPlaying = false;

        if (this.playbackIntervalId) {
            clearInterval(this.playbackIntervalId);
        }
    }

    testValueChange(event: any) {
        console.log("change detected in slider:", event);
    }

    async onSliderValueChange(event: any) {
        if (!this.recordedAudioFilePath) return;
        
        const slider = event.object as Slider;
        const newValue = slider.value;

        if (Math.abs(newValue - this.currentPlaybackPosition) <= 1) return;

        const seekTime = (newValue / 100) * this.totalDuration;
        await this.audioPlayer.seekTo(seekTime)

        this.currentPlaybackPosition = newValue;
        this.currentTime = this.audioPlayer.currentTime / 1000;
    }
}
