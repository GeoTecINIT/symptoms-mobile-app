import { Component, Input } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";

@Component({
    selector: "SymBackActionBar",
    templateUrl: "./back-action-bar.component.html",
    styleUrls: ["./back-action-bar.component.scss"],
})
export class BackActionBarComponent {
    @Input() title: string;

    constructor(private navigationService: NavigationService) {}

    onBack() {
        this.navigationService.goBack();
    }
}
