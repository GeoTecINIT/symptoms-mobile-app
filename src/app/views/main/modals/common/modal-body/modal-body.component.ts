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
    currentHour: string;

    constructor(
        private cd: ChangeDetectorRef,
        private modalService: ModalDialogService
    ) {}

    ngOnChanges() {
        // this.isCurrentHourWithinRange;
        this.cd.detectChanges();
    }

    get isContextualConditionsNotEmpty() {
        return this.contextualConditions && Object.keys(this.contextualConditions).length !== 0;
    }

    get timeRangeFromContextualConditions(): string {
        const timeRange = this.contextualConditions.timeRange;
        if (timeRange === undefined) return undefined;

        const startTime = this.contextualConditions.timeRange.startTime;
        const endTime = this.contextualConditions.timeRange.endTime;

        const startHours = startTime.hours.toString().padStart(2, "0");
        const startMinutes = startTime.minutes.toString().padStart(2, "0");
        const endHours = endTime.hours.toString().padStart(2, "0");
        const endMinutes = endTime.minutes.toString().padStart(2, "0");

        return `${startHours}:${startMinutes} a ${endHours}:${endMinutes}`;
    }

    get isCurrentHourWithinRange(): boolean {
        const now = new Date();

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        this.currentHour = `${currentHours}:${currentMinutes}`;

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

    get lightConditionFromContextualConditions(): string {
        const lightCondition = this.contextualConditions.lightCondition;
        if (lightCondition === undefined) return undefined;

        switch (lightCondition.value) {
            case LightCondition.SUNRISE:
                return "Amanecer";
            case LightCondition.SUNSET:
                return "Atardecer";
            case LightCondition.DAY:
                return "Día";
            case LightCondition.NIGHT:
                return "Noche";
        }
    }

    get lightConditionFromWeatherSummary(): string {
        const lightCondition = this.weatherSummary.lightCondition;
        if (lightCondition === undefined) return undefined;

        switch (lightCondition) {
            case LightCondition.SUNRISE:
                return "Amanecer";
            case LightCondition.SUNSET:
                return "Atardecer";
            case LightCondition.DAY:
                return "Día";
            case LightCondition.NIGHT:
                return "Noche";
        }
    }

    get weatherAndWindFromContextualConditions(): string {
        const weather = this.getWeatherFromContextualConditions();
        const wind = this.getWindFromContextualConditions();
        let text = "";

        if (!weather && !wind) return undefined;
        else if (!weather) text += wind;
        else if (!wind) text += weather;
        else
            text += `${this.getWeatherFromContextualConditions()} ${this.getWindFromContextualConditions()}`;

        return text;
    }

    get weatherAndWindFromWeatherSummary(): string {
        const weather = this.getWeatherFromWeatherSummary();
        const wind = this.getWindFromWeatherSummary();
        let text = "";

        if (!weather && !wind) return undefined;
        else if (!weather) text += wind;
        else if (!wind) text += weather;
        else
            text += `${this.getWeatherFromWeatherSummary()} ${this.getWindFromWeatherSummary()}`;

        return text;
    }

    private getWeatherFromContextualConditions(): string {
        if (this.contextualConditions.weather === undefined) return "";
        switch (this.contextualConditions.weather) {
            case Weather.THUNDERSTORM:
                return "Tormenta eléctrica";
            case Weather.DRIZZLE:
                return "Llovizna";
            case Weather.RAIN:
                return "Lluvia";
            case Weather.SNOW:
                return "Nieve";
            case Weather.MIST:
                return "Niebla";
            case Weather.SMOKE:
                return "Humo";
            case Weather.DUST:
                return "Polvo";
            case Weather.SAND:
                return "Arena";
            case Weather.ASH:
                return "Ceniza";
            case Weather.SQUALL:
                return "Chubasco";
            case Weather.TORNADO:
                return "Tornado";
            case Weather.CLEAR:
                return "Despejado";
            case Weather.CLOUDS:
                return "Nublado";
        }
    }

    private getWeatherFromWeatherSummary(): string {
        if (this.contextualConditions.weather === undefined) return "";
        switch (this.contextualConditions.weather) {
            case Weather.THUNDERSTORM:
                return "Tormenta eléctrica";
            case Weather.DRIZZLE:
                return "Llovizna";
            case Weather.RAIN:
                return "Lluvia";
            case Weather.SNOW:
                return "Nieve";
            case Weather.MIST:
                return "Niebla";
            case Weather.SMOKE:
                return "Humo";
            case Weather.DUST:
                return "Polvo";
            case Weather.SAND:
                return "Arena";
            case Weather.ASH:
                return "Ceniza";
            case Weather.SQUALL:
                return "Chubasco";
            case Weather.TORNADO:
                return "Tornado";
            case Weather.CLEAR:
                return "Despejado";
            case Weather.CLOUDS:
                return "Nublado";
        }
    }

    private getWindFromContextualConditions(): string {
        if (this.contextualConditions.isWindy === undefined) return "";
        if (this.contextualConditions.isWindy) {
            return "con viento";
        } else {
            return "sin viento";
        }
    }

    private getWindFromWeatherSummary(): string {
        if (this.weatherSummary.isWindy === undefined) return "";
        if (this.weatherSummary.isWindy) {
            return "con viento";
        } else {
            return "sin viento";
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
