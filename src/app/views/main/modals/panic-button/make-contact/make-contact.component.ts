import { Component } from "@angular/core";
import { SeekHelpService } from "./seek-help.service";

@Component({
    selector: "SymMakeContact",
    templateUrl: "./make-contact.component.html",
    styleUrls: ["./make-contact.component.scss"],
})
export class MakeContactComponent {
    constructor(private panicButtonService: SeekHelpService) {}

    onCallTap() {
        this.panicButtonService.intendsToMakeEmergencyCall();
    }
}
