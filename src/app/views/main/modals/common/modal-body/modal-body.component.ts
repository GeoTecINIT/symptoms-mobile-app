import {
    Component,
    Input,
    ChangeDetectorRef,
    ViewContainerRef,
} from "@angular/core";
import { ContextualConditions, WeatherSummary } from "~/app/core/weather";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular";
import { ContextualConditionsComplianceDialogComponent } from "./contextual-conditions-compliance-dialog/contextual-conditions-compliance-dialog.component";

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
    @Input() contextualConditions?: ContextualConditions;
    @Input() weatherSummary?: WeatherSummary;

    showingImage: boolean = false;
    vcRef: ViewContainerRef;

    constructor(
        private cd: ChangeDetectorRef,
        private modalService: ModalDialogService
    ) {}

    ngOnChanges() {
        // this.isCurrentHourWithinRange;
        this.cd.detectChanges();
    }

    get isContextualConditionsNotEmpty() {
        return Object.keys(this.contextualConditions).length !== 0;
    }

    get isCurrentHourWithinRange(): boolean {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const startHours = this.contextualConditions.timeRange.startTime.hours;
        const startMinutes =
            this.contextualConditions.timeRange.startTime.minutes;
        const endHours = this.contextualConditions.timeRange.endTime.hours;
        const endMinutes = this.contextualConditions.timeRange.endTime.minutes;

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        const currentTotalMinutes = currentHours * 60 + currentMinutes;

        if (startTotalMinutes <= endTotalMinutes) {
            return (
                currentTotalMinutes >= startTotalMinutes &&
                currentTotalMinutes <= endTotalMinutes
            );
        } else {
            // Handle the case where the end time is after midnight
            return (
                currentTotalMinutes >= startTotalMinutes ||
                currentTotalMinutes <= endTotalMinutes
            );
        }
    }

    printContextualConditions() {
        console.log("contextual conditions 👉👉👉", this.contextualConditions);
        console.log("weather summary", this.weatherSummary);
        // console.log(
        //     "isCurrentHourWithinRange",
        //     this.isCurrentHourWithinRange()
        // );
    }

    showImage() {
        this.showingImage = !this.showingImage;
    }

    showCompliancePopup() {
        const options: ModalDialogOptions = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef,
        };

        this.modalService.showModal(
            ContextualConditionsComplianceDialogComponent,
            options
        );
    }
}
