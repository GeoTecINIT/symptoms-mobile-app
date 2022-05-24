import { Injectable } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

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
