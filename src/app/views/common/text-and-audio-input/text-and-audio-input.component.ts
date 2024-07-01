import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EventData, TextField } from "@nativescript/core";

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

    @Input() marginTop = 0;
    @Input() marginBottom = 0;

    @Output() textChanged = new EventEmitter<string>();
    @Output() returnKeyPressed = new EventEmitter<void>();

    // Audio recorder related Output
    @Output() public audioRecorded = new EventEmitter<string>();

    // Icon Unicode constants
    playIcon = "\ue034";
    pauseIcon = "\ue037";
    stopIcon = "\ue047";
    recordIcon = "\ue029";
    deleteIcon = "\ue872";

    focus: boolean = false;
    isRecording: boolean = false;
    isPlaying: boolean = false;
    recordFilePath: string = '';
    timerDisplay: string = '00:00'

    manageRecording() {
        this.isRecording = !this.isRecording;
        if (!this.isRecording) {
            this.recordFilePath = "/path/to/audio";
            this.text = "";
        }
    }

    managePlayback() {
        this.isPlaying = !this.isPlaying;
    }

    deleteRecording() {
        this.recordFilePath = '';
        this.managePlayback();
    }

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
}
