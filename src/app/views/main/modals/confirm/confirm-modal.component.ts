import { Component, OnDestroy, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";
import { NavigationService } from "~/app/views/navigation.service";
import { ConfirmModalService } from "./confirm-modal.service";
import { DialogsService } from "~/app/views/common/dialogs.service";

import { ConfirmModalOptions } from "~/app/core/modals/confirm";
import { AndroidApplication, Application } from "@nativescript/core";

export const INSTANCE_ID_KEY = "instanceId";

@Component({
    selector: "SymConfirmModal",
    templateUrl: "./confirm-modal.component.html",
    styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
    instanceId: number;
    options: ConfirmModalOptions;

    private readonly backCallback: () => void;

    get hasCancelConfirm(): boolean {
        return this.options.cancelConfirmOptions !== undefined;
    }

    constructor(
        activeRoute: ActivatedRoute,
        router: Router,
        private navigationService: NavigationService,
        private confirmModalService: ConfirmModalService,
        private dialogsService: DialogsService
    ) {
        this.instanceId = +activeRoute.snapshot.paramMap.get(INSTANCE_ID_KEY);
        this.options = router.getCurrentNavigation().extras
            .state as ConfirmModalOptions;

        this.backCallback = () => {
            this.confirmModalService.gotConfirmation(this.instanceId);
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

    onConfirmTap() {
        this.done(true);
    }

    onCancelTap() {
        if (!this.hasCancelConfirm) {
            this.done(false);

            return;
        }

        this.dialogsService
            .askConfirmationWithPositiveAction(
                this.options.cancelConfirmOptions
            )
            .then((confirms) => {
                if (confirms) this.done(false);
            });
    }

    done(result: boolean) {
        this.navigationService.goBack();
        this.confirmModalService.gotConfirmation(this.instanceId, result);
    }
}
