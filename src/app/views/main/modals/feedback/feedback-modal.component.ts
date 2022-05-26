import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { FeedbackModalOptions } from "~/app/core/modals/feedback";
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationService } from "../../../navigation.service";
import { FeedbackModalService } from "./feedback-modal.service";
import { AndroidApplication, Application } from "@nativescript/core";

export const INSTANCE_ID_KEY = "instanceId";

@Component({
    selector: "SymFeedbackModal",
    templateUrl: "./feedback-modal.component.html",
    styleUrls: ["./feedback-modal.component.scss"],
})
export class FeedbackModalComponent implements OnInit, OnDestroy {
    options: FeedbackModalOptions;
    answer: string;
    showConfirmScreen = false;

    private readonly instanceId: number;
    private readonly backCallback: () => void;

    get hasCompletionScreen(): boolean {
        return !!this.options.completionScreen;
    }

    constructor(
        activeRoute: ActivatedRoute,
        router: Router,
        private navigationService: NavigationService,
        private feedbackModalService: FeedbackModalService
    ) {
        this.instanceId = +activeRoute.snapshot.paramMap.get(INSTANCE_ID_KEY);
        this.options = router.getCurrentNavigation().extras
            .state as FeedbackModalOptions;

        this.backCallback = () => {
            this.emitFeedback();
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

    onClose() {
        this.navigationService.goBack();
        this.emitFeedback();
    }

    onAnswer(answer: string) {
        this.answer = answer;
        if (this.hasCompletionScreen) {
            this.showConfirmScreen = true;
        } else {
            this.onClose();
        }
    }

    emitFeedback() {
        this.feedbackModalService.gotFeedback(this.instanceId, this.answer);
    }
}
