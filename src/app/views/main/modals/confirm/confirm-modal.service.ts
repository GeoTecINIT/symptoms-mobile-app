import { Injectable } from "@angular/core";
import { ConfirmModule } from "./confirm.module";

import { MainViewService } from "../../main-view.service";
import { ConfirmModalComponent } from "~/app/views/main/modals/confirm/confirm-modal.component";
import { ConfirmModalOptions } from "./options";

@Injectable({
    providedIn: ConfirmModule,
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
