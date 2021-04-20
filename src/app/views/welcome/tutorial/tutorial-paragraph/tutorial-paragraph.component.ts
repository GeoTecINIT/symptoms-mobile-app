import { Component, Input } from "@angular/core";

@Component({
    selector: "SymTutorialParagraph",
    templateUrl: "./tutorial-paragraph.component.html",
    styleUrls: ["./tutorial-paragraph.component.scss"],
})
export class TutorialParagraphComponent {
    @Input() text = "";
    @Input() bold = false;
}
