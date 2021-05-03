import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { QuestionsModalOptions } from "../options";
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

    get currentStepAnswer(): any {
        const savedAnswer = this.answers[this.currentStep];
        if (savedAnswer) {
            return savedAnswer.answer;
        }

        return undefined;
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
        this.answers[result.step] = {
            title: this.options.questions[result.step].title,
            answer: result.answer,
        };
    }
}
