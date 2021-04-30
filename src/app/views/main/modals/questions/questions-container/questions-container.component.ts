import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { QuestionType } from "~/app/views/main/modals/questions/options";

@Component({
    selector: "SymQuestionsContainer",
    templateUrl: "./questions-container.component.html",
    styleUrls: ["./questions-container.component.scss"],
})
export class QuestionsContainerComponent {
    questionStep = 0;

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

    get ongoingQuestion(): QuestionType {
        return this.questions[this.questionStep];
    }

    get questionsAmount(): number {
        return this.questions.length;
    }

    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback();
    }
}
