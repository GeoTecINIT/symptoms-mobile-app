import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";
import { ConfirmModalComponent } from "~/app/views/main/modals/confirm/confirm-modal.component";
import { ConfirmModalOptions } from "~/app/core/modals/confirm";

@Injectable({
    providedIn: "root",
})
export class ConfirmModalService {
    constructor(private mainViewService: MainViewService) {}

    show(options: ConfirmModalOptions): Promise<boolean> {
        return this.mainViewService.showFullScreenAnimatedModal(
            ConfirmModalComponent,
            options
        );
    }
}
