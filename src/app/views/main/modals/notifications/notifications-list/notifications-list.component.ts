import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "SymNotificationsList",
    templateUrl: "./notifications-list.component.html",
    styleUrls: ["./notifications-list.component.scss"],
})
export class NotificationsListComponent {
    constructor(private params: ModalDialogParams) {}

    onClose() {
        this.params.closeCallback();
    }
}
