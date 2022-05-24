import { Injectable } from "@angular/core";

import { MainViewService } from "../../main-view.service";

import { SimulationModalComponent } from "./simulation-modal.component";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { NavigationService } from "../../../navigation.service";

@Injectable({
    providedIn: "root",
})
export class SimulationModalService {
    constructor(private navigationService: NavigationService) {}

    show() {
        this.navigationService.navigate(["/main/simulation"], {
            transition: "fade",
            duration: 200,
        });
    }
}
