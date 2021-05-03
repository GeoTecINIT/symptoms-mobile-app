import { Component, Input } from "@angular/core";

@Component({
    selector: "SymModalBody",
    templateUrl: "./modal-body.component.html",
    styleUrls: ["./modal-body.component.scss"],
})
export class ModalBodyComponent {
    @Input() emoji: string;
    @Input() iconCode: string;
    @Input() bodyText = "";

    @Input() currentStep: number;
    @Input() stepAmount: number;
}
