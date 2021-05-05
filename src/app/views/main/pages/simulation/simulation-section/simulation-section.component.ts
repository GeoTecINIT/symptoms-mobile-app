import { Component, Input } from "@angular/core";

@Component({
    selector: "SymSimulationSection",
    templateUrl: "./simulation-section.component.html",
    styleUrls: ["./simulation-section.component.scss"],
})
export class SimulationSectionComponent {
    @Input() title = "";
}
