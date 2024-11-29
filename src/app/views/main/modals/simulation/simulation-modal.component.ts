import { Component } from "@angular/core";
import { NavigationService } from "../../../navigation.service";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { awarns } from "@awarns/core";
import { ServerApiService } from "~/app/core/server";
import { AccountService } from "~/app/core/account";

@Component({
    selector: "SymSimulationModal",
    templateUrl: "./simulation-modal.component.html",
    styleUrls: ["./simulation-modal.component.scss"],
})
export class SimulationModalComponent {
    btnMargin = 4;

    private logger: Logger;

    constructor(
        private navigationService: NavigationService,
        private serverClientService: ServerApiService,
        private accountService: AccountService
    ) {
        this.logger = getLogger("SimulationModalComponent");
    }

    onCloseTap() {
        this.navigationService.goBack();
    }

    emitAwarnsFrameworkEvent(eventName: string, data?: any) {
        awarns.emitEvent(eventName, data);
    }

    async loadPreviousExposures() {
        await this.serverClientService.queries.getAllRequest(
            this.accountService.deviceProfile.patientId,
            this.accountService.deviceProfile.studyId
        );
    }
}
