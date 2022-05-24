import { Injectable } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";

@Injectable({
    providedIn: "root",
})
export class PanicButtonModalService {
    constructor(private navigationService: NavigationService) {}

    show() {
        this.navigationService.navigate(["/main/panic-button"], {
            transition: "fade",
            duration: 200,
        });
    }
}
