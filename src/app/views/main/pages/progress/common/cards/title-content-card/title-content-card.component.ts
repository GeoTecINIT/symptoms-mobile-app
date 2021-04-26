import { Component, Input } from "@angular/core";

@Component({
    selector: "SymTitleContentCard",
    templateUrl: "./title-content-card.component.html",
    styleUrls: ["./title-content-card.component.scss"],
})
export class TitleContentCardComponent {
    @Input() iconCode = "";
    @Input() title = "";
    @Input() subtitle = "";
}
