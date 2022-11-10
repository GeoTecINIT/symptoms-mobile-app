import { Component } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { ContentViewModalService } from "~/app/views/main/modals/content-view";

@Component({
    selector: "SymPanicButtonModal",
    templateUrl: "./panic-button-modal.component.html",
    styleUrls: ["./panic-button-modal.component.scss"],
})
export class PanicButtonModalComponent {
    hasSeenGuide = false;

    constructor(
        private contentViewModalService: ContentViewModalService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    onClose() {
        this.navigationService.goBack();
    }

    onOpenGuide() {
        this.contentViewModalService
            .showContent("cg02")
            .then(() => (this.hasSeenGuide = true));
    }

    onMakeContact() {
        this.navigationService.navigate(["./make-contact"], {
            source: this.activeRoute,
        });
    }
}
