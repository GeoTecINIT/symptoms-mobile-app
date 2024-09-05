import {
    Component,
    Input,
    ChangeDetectorRef,
    ViewContainerRef,
} from "@angular/core";
import { ContextualConditions, WeatherSummary } from "~/app/core/weather";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { ContextualConditionsComplianceDialogComponent } from "./contextual-conditions-compliance-dialog/contextual-conditions-compliance-dialog.component";
import { Weather, LightCondition } from "~/app/core/weather";
import { formatAsHour } from "~/app/core/utils/time"

@Component({
    selector: "SymModalBody",
    templateUrl: "./modal-body.component.html",
    styleUrls: ["./modal-body.component.scss"],
})
export class ModalBodyComponent {
    @Input() emoji: string;
    @Input() iconCode: string;
    @Input() bodyText = "";
    @Input() helpImageURI = "";

    @Input() currentStep: number;
    @Input() stepAmount: number;
    @Input() contextualConditions?: ContextualConditions;
    @Input() weatherSummary?: WeatherSummary;

    showingImage: boolean = false;
    vcRef: ViewContainerRef;
    currentTime: Date;

    constructor() {
        this.currentTime = new Date()
    }

    showImage() {
        this.showingImage = !this.showingImage;
    }
}
