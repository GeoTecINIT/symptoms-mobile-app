import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { QuestionType } from "~/app/views/main/modals/questions/options";
import {
    QuestionAnswer,
    QuestionStepResult,
} from "~/app/views/main/modals/questions/answers";

@Component({
    selector: "SymQuestionsContainer",
    templateUrl: "./questions-container.component.html",
    styleUrls: ["./questions-container.component.scss"],
})
export class QuestionsContainerComponent {
    questions: Array<QuestionType> = [
        {
            title: "De 0 a 10, ¿cómo puntuarías tu nivel de ansiedad actual?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title:
                "De 0 a 10, ¿cómo puntuarías las ganas que tienes de salir de aquí?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title:
                "De 0 a 10, ¿cómo puntuarías tu grado de creencia en pensamientos?",
            type: "range",
            from: 0,
            to: 10,
        },
    ];

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
        return this.questions.length;
    }

    get isLastQuestion(): boolean {
        return this.questionsAmount - this.currentStep === 1;
    }

    constructor(private params: ModalDialogParams) {}

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
            title: this.questions[result.step].title,
            answer: result.answer,
        };
    }
}
