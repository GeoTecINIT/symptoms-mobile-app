import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";
import { ConfirmModalComponent } from "~/app/views/main/modals/confirm/confirm-modal.component";
import { ConfirmModalOptions } from "~/app/core/modals/confirm";
import { emitPatientConfirmationAcquiredEvent } from "~/app/core/framework/events";
import { UserConfirmation } from "@awarns/notifications";

@Injectable({
    providedIn: "root",
})
export class ConfirmModalService {
    constructor(private mainViewService: MainViewService) {}

    show(
        confirmationId: string,
        options: ConfirmModalOptions,
        notificationId?: number
    ): Promise<boolean> {
        return this.mainViewService
            .showFullScreenAnimatedModal(ConfirmModalComponent, options)
            .then((result) => {
                emitPatientConfirmationAcquiredEvent(
                    new UserConfirmation(
                        confirmationId,
                        options.question,
                        options.negative ? !result : result,
                        notificationId
                    )
                );

                return result;
            });
    }
}
