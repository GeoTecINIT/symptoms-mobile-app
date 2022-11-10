import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AndroidApplication, Application } from "@nativescript/core";

import { QuestionsModalOptions } from "~/app/core/modals/questions";
import { QuestionAnswer, QuestionStepResult } from "./answers";
import { NavigationService } from "../../../navigation.service";
import { QuestionsModalService } from "./questions-modal.service";

export const INSTANCE_ID_KEY = "instanceId";

@Component({
    selector: "SymQuestionsModal",
    templateUrl: "./questions-modal.component.html",
    styleUrls: ["./questions-modal.component.scss"],
})
export class QuestionsModalComponent implements OnInit, OnDestroy {
    options: QuestionsModalOptions;
    currentStep = 0;
    answers: Array<QuestionAnswer> = [];
    showCompletionScreen = false;

    private readonly instanceId: number;
    private readonly backCallback: () => void;

    get currentStepAnswer(): QuestionAnswer {
        return this.answers[this.currentStep];
    }

    get questionsAmount(): number {
        return this.options.questions.length;
    }

    get isLastQuestion(): boolean {
        return this.questionsAmount - this.currentStep === 1;
    }

    get hasCompletionScreen(): boolean {
        return !!this.options.completionScreen;
    }

    constructor(
        router: Router,
        activeRoute: ActivatedRoute,
        private navigationService: NavigationService,
        private questionsModalService: QuestionsModalService
    ) {
        this.options = router.getCurrentNavigation().extras
            .state as QuestionsModalOptions;
        this.instanceId = +activeRoute.snapshot.paramMap.get(INSTANCE_ID_KEY);

        this.backCallback = () => {
            this.questionsModalService.gotAnswers(this.instanceId);
        };
    }

    ngOnInit() {
        Application.android.on(
            AndroidApplication.activityBackPressedEvent,
            this.backCallback
        );
    }

    ngOnDestroy() {
        Application.android.off(
            AndroidApplication.activityBackPressedEvent,
            this.backCallback
        );
    }

    onAnswerProvided(result: QuestionStepResult) {
        this.updateAnswer(result);
        if (this.isLastQuestion) {
            if (this.hasCompletionScreen) {
                this.showCompletionScreen = true;
            } else {
                this.onClose();
            }

            return;
        }
        this.currentStep++;
    }

    onBackTap() {
        if (this.currentStep === 0) return;
        this.currentStep--;
    }

    onClose() {
        this.navigationService.goBack();
        this.questionsModalService.gotAnswers(this.instanceId, this.answers);
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
