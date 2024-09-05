import { Component, Input } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { formatAsHour } from '~/app/core/utils/time';
import { ContextualConditions, LightCondition, Weather, WeatherSummary } from "~/app/core/weather";
import { ContextualConditionsComplianceDialogComponent } from "../contextual-conditions-compliance-dialog/contextual-conditions-compliance-dialog.component";

@Component({
    selector: "SymContextualConditionsCard",
    templateUrl: "./contextual-conditions-card.component.html",
    styleUrls: ["./contextual-conditions-card.component.scss"],
})
export class ContextualConditionsCard {
    @Input() contextualConditions?: ContextualConditions;
    @Input() weatherSummary?: WeatherSummary;

    currentDate: Date = new Date();

    constructor(
        private modalService: ModalDialogService
    ) {}

    get showContextualConditionsCard() {
        return this.contextualConditions && Object.keys(this.contextualConditions).length !== 0 && this.weatherSummary; 
    }

    showCompliancePopup() {
        const options: ModalDialogOptions = {
            context: {},
            fullscreen: false,
        };

        this.modalService.showModal(
            ContextualConditionsComplianceDialogComponent,
            options
        );
    }
    
    get timeRangeFromContextualConditions(): string {
        const timeRange = this.contextualConditions.timeRange;
        if (timeRange === undefined) return "";

        const startTime = this.contextualConditions.timeRange.startTime;
        const endTime = this.contextualConditions.timeRange.endTime;

        const startHours = startTime.hours.toString().padStart(2, "0");
        const startMinutes = startTime.minutes.toString().padStart(2, "0");
        const endHours = endTime.hours.toString().padStart(2, "0");
        const endMinutes = endTime.minutes.toString().padStart(2, "0");

        return `${startHours}:${startMinutes} a ${endHours}:${endMinutes}`;
    }

    get currentTimeFormatted(): string {
        return formatAsHour(this.currentDate);
    }

    get isCurrentTimeWithinRange(): boolean {
        const currentHours = this.currentDate.getHours();
        const currentMinutes = this.currentDate.getMinutes();

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
        if (lightCondition === undefined) return "";

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
        if (!this.weatherSummary || this.weatherSummary.lightCondition === undefined) return undefined;

        switch (this.weatherSummary.lightCondition) {
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

    get isLightConditionMatching(): boolean {
        return this.lightConditionFromContextualConditions === this.lightConditionFromWeatherSummary;
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

    get isWeatherAndWindMatching(): boolean {
        return this.weatherAndWindFromContextualConditions === this.weatherAndWindFromWeatherSummary;
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
        if (!this.weatherSummary || this.weatherSummary.weather === undefined) return "";
        switch (this.weatherSummary.weather) {
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
        if (!this.weatherSummary || this.weatherSummary.isWindy === undefined) return "";
        if (this.weatherSummary.isWindy) {
            return "con viento";
        } else {
            return "sin viento";
        }
    }
}
