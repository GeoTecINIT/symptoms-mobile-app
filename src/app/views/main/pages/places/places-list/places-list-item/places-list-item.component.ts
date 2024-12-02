import {
    Component,
    Input,
    NgZone,
    HostListener,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { Animation, AnimationDefinition } from "@nativescript/core";

import { Record, Change } from "@awarns/core/entities";
import { Weather, LightCondition } from "~/app/core/weather";
import { Subject, takeUntil } from "rxjs";
import { AppRecordType } from "~/app/core/app-record-type";
import { FetchCondition, recordsStore } from "@awarns/persistence";
import { ExtendedAreaOfInterest } from "~/app/core/account/app-config";
import { Logger, getLogger } from "~/app/core/utils/logger";

// To standarize contextual condition from any interface to text and boolean
export interface FormatedContextualCondition {
    text: string;
    isMandatory: boolean;
}

@Component({
    selector: "SymPlacesListItem",
    templateUrl: "./places-list-item.component.html",
    styleUrls: ["./places-list-item.component.scss"],
})
export class PlacesListItemComponent {
    @Input() place: ExtendedAreaOfInterest;
    @Input() isExpanded: boolean = false;

    @ViewChild("expandableContainer", { static: false })
    expandableContainer: ElementRef;

    records: Array<Record> = [];

    private unloaded$ = new Subject<void>();

    private logger: Logger;

    constructor(private ngZone: NgZone) {}

    @HostListener("loaded")
    onLoaded(): void {
        this.subscribeToRecordChanges();
        // this.updateView();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
        this.unloaded$.complete();
    }

    private subscribeToRecordChanges() {
        const conditions: Array<FetchCondition> = [
            { property: "change", comparison: "=", value: Change.END },
            { property: "successful", comparison: "=", value: true },
            { property: "place.id", comparison: "=", value: this.place.id },
        ];
        recordsStore
            .listBy(AppRecordType.ExposureChange, "desc", conditions)
            .pipe(takeUntil(this.unloaded$))
            .subscribe((records) => {
                this.ngZone.run(() => {
                    this.records = records;
                });
            });
    }

    get anyContextualConditions() {
        return !!this.timeRange || !!this.lightCondition || this.weatherAndWind;
    }

    get timeRange(): FormatedContextualCondition {
        const timeRange = this.place.contextualConditions.timeRange;
        if (timeRange === undefined) return undefined;

        const startTime = this.place.contextualConditions.timeRange.startTime;
        const endTime = this.place.contextualConditions.timeRange.endTime;

        const startHours = startTime.hours.toString().padStart(2, "0");
        const startMinutes = startTime.minutes.toString().padStart(2, "0");
        const endHours = endTime.hours.toString().padStart(2, "0");
        const endMinutes = endTime.minutes.toString().padStart(2, "0");

        return {
            text: `Horario: De ${startHours}:${startMinutes} a ${endHours}:${endMinutes}`,
            isMandatory: timeRange.isMandatory,
        };
    }

    get weatherAndWind(): FormatedContextualCondition {
        const weather = this.getWeather();
        const wind = this.getWind();
        let text = "Tiempo: ";

        if (!weather && !wind) return undefined;
        else if (!weather) text += wind;
        else if (!wind) text += weather;
        else text += `${this.getWeather()} ${this.getWind()}`;

        return { text, isMandatory: false };
    }

    get numberOfExposures(): number {
        return this.records.length;
    }

    get lightCondition(): FormatedContextualCondition {
        const lightCondition = this.place.contextualConditions.lightCondition;
        if (lightCondition === undefined) return undefined;

        let text = "Condición lumínica: ";
        switch (lightCondition.value) {
            case LightCondition.SUNRISE:
                text += "Amanecer";
                break;
            case LightCondition.SUNSET:
                text += "Atardecer";
                break;
            case LightCondition.DAY:
                text += "Día";
                break;
            case LightCondition.NIGHT:
                text += "Noche";
                break;
        }

        return { text, isMandatory: lightCondition.isMandatory };
    }

    // TODO: delete this
    // not used now, that's why the animation doesn't work
    toggleExpand(event: Event) {
        this.isExpanded = !this.isExpanded;
        this.animateExpansion();
    }

    private animateExpansion(): void {
        if (
            this.expandableContainer &&
            this.expandableContainer.nativeElement
        ) {
            const container = this.expandableContainer.nativeElement;
            const animationDefs: Array<AnimationDefinition> = [
                {
                    target: container,
                    scale: {
                        x: this.isExpanded ? 1 : 0.1,
                        y: this.isExpanded ? 1 : 0.1,
                    }, // Asegúrate de que el elemento no desaparezca completamente si eso afecta la UX
                    opacity: this.isExpanded ? 1 : 0,
                    duration: 5000,
                },
            ];

            const animation = new Animation(animationDefs);

            animation.play().catch((e) => {
                this.getLogger().error(
                    `Error during animation in places list item: ${e}`
                );
            });
        }
    }

    private getWind(): string {
        if (this.place.contextualConditions.isWindy === undefined) return "";
        if (this.place.contextualConditions.isWindy) {
            return "con viento";
        } else {
            return "sin viento";
        }
    }

    private getWeather(): string {
        if (this.place.contextualConditions.weather === undefined) return "";
        switch (this.place.contextualConditions.weather) {
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

    private getLogger() {
        if (!this.logger) {
            this.logger = getLogger("PlacesListController");
        }

        return this.logger;
    }
}
