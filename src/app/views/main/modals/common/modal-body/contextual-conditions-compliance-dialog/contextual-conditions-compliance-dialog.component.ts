import { Component } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "SymContextualConditionComplianceDialog",
    templateUrl: "./contextual-conditions-compliance-dialog.component.html",
    styleUrls: ["./contextual-conditions-compliance-dialog.component.scss"],
})
export class ContextualConditionsComplianceDialogComponent {
    constructor(private params: ModalDialogParams) {}

    close() {
        this.params.closeCallback();
    }
}
