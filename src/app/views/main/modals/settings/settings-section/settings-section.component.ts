import { Component, Input } from "@angular/core";

@Component({
    selector: "SymSettingsSection",
    templateUrl: "./settings-section.component.html",
    styleUrls: ["./settings-section.component.scss"],
})
export class SettingsSectionComponent {
    @Input() title = "";
    @Input() withSeparator = true;
}
