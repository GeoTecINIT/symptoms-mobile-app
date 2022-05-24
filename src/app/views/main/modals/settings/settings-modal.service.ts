import { Injectable } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

@Injectable({
    providedIn: "root",
})
export class SettingsModalService {
    constructor(private navigationService: NavigationService) {}

    show() {
        this.navigationService.navigate(["/main/settings"], {
            transition: "fade",
            duration: 200,
        });
    }
}
