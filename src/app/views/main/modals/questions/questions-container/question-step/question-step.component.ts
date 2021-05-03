import { Component, EventEmitter, Input, Output } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";

import { QuestionType } from "../../options";
import { QuestionStepResult } from "../../answers";

type QuestionStepType = "standalone" | "first" | "middle" | "last";

@Component({
    selector: "SymQuestionStep",
    templateUrl: "./question-step.component.html",
    styleUrls: ["./question-step.component.scss"],
    animations: [
        trigger("fade", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("0.5s", style({ opacity: 1 })),
            ]),
            transition(":leave", [
                style({ opacity: 1 }),
                animate("0.5s", style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class QuestionStepComponent {
    @Input() question: QuestionType;
    @Input() index: number;
    @Input() amount: number;
    @Input() savedAnswer: any;

    @Output() backTap = new EventEmitter();
    @Output() answerProvided = new EventEmitter<QuestionStepResult>();

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
        this.answerProvided.emit({
            step: this.index,
            answer: this.answer,
        });
    }

    onBackTap() {
        this.backTap.emit();
    }
}
