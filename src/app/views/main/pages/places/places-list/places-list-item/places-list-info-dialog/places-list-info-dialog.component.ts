import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "places-list-info-dialog",
    templateUrl: "./places-list-info-dialog.component.html",
    styleUrls: ["./places-list-info-dialog.component.scss"],
})
export class PlacesListInfoDialogComponent {
    constructor(private params: ModalDialogParams) {}

    close() {
        this.params.closeCallback();
    }
}
