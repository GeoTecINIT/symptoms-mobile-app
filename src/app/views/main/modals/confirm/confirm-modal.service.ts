import { Injectable } from "@angular/core";
import { ConfirmModule } from "./confirm.module";

import { MainViewService } from "../../main-view.service";
import { ConfirmModalComponent } from "~/app/views/main/modals/confirm/confirm-modal.component";

@Injectable({
    providedIn: ConfirmModule,
})
export class ConfirmModalService {
    constructor(private mainViewService: MainViewService) {}

    show(): Promise<void> {
        // TODO: Later on return something meaningful
        return this.mainViewService.showFullScreenAnimatedModal(
            ConfirmModalComponent
        );
    }
}
