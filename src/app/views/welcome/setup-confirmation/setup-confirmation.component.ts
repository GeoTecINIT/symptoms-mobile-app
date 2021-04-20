import { Component } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";

@Component({
    selector: "SymSetupConfirmation",
    templateUrl: "./setup-confirmation.component.html",
    styleUrls: ["./setup-confirmation.component.scss"],
})
export class SetupConfirmationComponent {
    constructor(private navigationService: NavigationService) {}

    onLetsGoTap() {
        this.navigationService.navigate(["/main"], null, true);
    }
}
