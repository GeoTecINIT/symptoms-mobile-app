import { Component } from "@angular/core";
import { NavigationService } from "~/app/views/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { ModalDialogParams } from "@nativescript/angular";
import { ContentViewModalService } from "~/app/views/main/modals/content-view";

@Component({
    selector: "SymContentDelivery",
    templateUrl: "./content-delivery.component.html",
    styleUrls: ["./content-delivery.component.scss"],
})
export class ContentDeliveryComponent {
    hasSeenGuide = false;

    constructor(
        private params: ModalDialogParams,
        private contentViewModalService: ContentViewModalService,
        private navigationService: NavigationService,
        private activeRoute: ActivatedRoute
    ) {}

    onClose() {
        this.params.closeCallback();
    }

    onOpenGuide() {
        this.contentViewModalService
            .showContent("cg02")
            .then(() => (this.hasSeenGuide = true));
    }

    onMakeContact() {
        this.navigationService.navigate(["./make-contact"], this.activeRoute);
    }
}
