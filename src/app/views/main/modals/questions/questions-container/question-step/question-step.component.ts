import { Component, EventEmitter, Input, Output } from "@angular/core";
import { QuestionType } from "../../options";

type QuestionStepType = "standalone" | "first" | "middle" | "last";

@Component({
    selector: "SymQuestionStep",
    templateUrl: "./question-step.component.html",
    styleUrls: ["./question-step.component.scss"],
})
export class QuestionStepComponent {
    @Input() question: QuestionType;
    @Input() index: number;
    @Input() amount: number;

    @Output() backTap = new EventEmitter();
    @Output() answerProvided = new EventEmitter<any>();

    answer: any;

    btnMargin = 6;
    btnSize: any = "md";

    get gotAnswer(): boolean {
        return this.answer !== undefined;
    }

    get stepType(): QuestionStepType {
        if (this.index === 0 && this.amount === 1) {
            return "standalone";
        }
        if (this.index === 0) {
            return "first";
        }
        if (this.amount - this.index === 1) {
            return "last";
        }

        return "middle";
    }

    onValueSelected(value: number) {
        this.answer = value;
    }

    onContinueTap() {
        this.answerProvided.emit(this.answer);
    }

    onBackTap() {
        this.backTap.emit();
    }
}
