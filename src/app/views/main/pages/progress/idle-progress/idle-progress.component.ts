import { Component } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "SymIdleProgress",
    templateUrl: "./idle-progress.component.html",
    styleUrls: ["./idle-progress.component.scss"],
})
export class IdleProgressComponent {
    constructor(
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    onSeeRecordsTap() {
        this.navigate("../records-list");
    }

    onSeeAggregatesTap() {
        this.navigate("../aggregate-list");
    }

    private navigate(route: string) {
        this.navigationService.navigate([route], this.activeRoute);
    }
}
