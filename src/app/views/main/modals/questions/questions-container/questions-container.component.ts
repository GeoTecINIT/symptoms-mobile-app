import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { QuestionsModalOptions } from "~/app/core/modals/questions";
import { QuestionAnswer, QuestionStepResult } from "../answers";

@Component({
    selector: "SymQuestionsContainer",
    templateUrl: "./questions-container.component.html",
    styleUrls: ["./questions-container.component.scss"],
})
export class QuestionsContainerComponent {
    options: QuestionsModalOptions;
    currentStep = 0;
    answers: Array<QuestionAnswer> = [];

    get currentStepAnswer(): QuestionAnswer {
        return this.answers[this.currentStep];
    }

    get questionsAmount(): number {
        return this.options.questions.length;
    }

    get isLastQuestion(): boolean {
        return this.questionsAmount - this.currentStep === 1;
    }

    constructor(private params: ModalDialogParams) {
        this.options = params.context as QuestionsModalOptions;
    }

    onAnswerProvided(result: QuestionStepResult) {
        this.updateAnswer(result);
        if (this.isLastQuestion) {
            this.params.closeCallback(this.answers);

            return;
        }
        this.currentStep++;
    }

    onBackTap() {
        if (this.currentStep === 0) return;
        this.currentStep--;
    }

    private updateAnswer(result: QuestionStepResult) {
        const { step, answer, answerTime } = result;
        this.answers[step] = {
            title: this.options.questions[step].title,
            answer,
            answerTime,
        };
    }
}
