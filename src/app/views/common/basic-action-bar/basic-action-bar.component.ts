import { Component, Input } from "@angular/core";

@Component({
    selector: "SymBasicActionBar",
    templateUrl: "./basic-action-bar.component.html",
    styleUrls: ["./basic-action-bar.component.scss"],
})
export class BasicActionBarComponent {
    @Input() title: string;
}
