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

import { AreaOfInterest } from "@awarns/geofencing";
import { Record, Change } from "@awarns/core/entities";

import { Subject, takeUntil } from "rxjs";
import { AppRecordType } from "~/app/core/app-record-type";
import { FetchCondition, recordsStore } from "@awarns/persistence";

export enum LightCondition {
    DAY = "Day",
    SUNSET = "Sunset",
    SUNRISE = "Sunrise",
    NIGHT = "Night",
}

export const enum Weather {
    THUNDERSTORM = "Thunderstorm",
    DRIZZLE = "Drizzle",
    RAIN = "Rain",
    SNOW = "Snow",
    MIST = "Mist",
    SMOKE = "Smoke",
    DUST = "Dust",
    SAND = "Sand",
    ASH = "Ash",
    SQUALL = "Squall",
    TORNADO = "Tornado",
    CLEAR = "Clear",
    CLOUDS = "Clouds",
}

export interface ExtendedAreaOfInterest extends AreaOfInterest {
    contextualConditions: {
        isWindy: boolean;
        timeRange: {
            startTime: {
                hours: number;
                minutes: number;
            };
            endTime: {
                hours: number;
                minutes: number;
            };
            isMandatory: true;
        };
        lightCondition: {
            value: string;
            isMandatory: boolean;
        };
        weather: Weather;
    };
}

@Component({
    selector: "SymPlacesListItem",
    templateUrl: "./places-list-item.component.html",
    styleUrls: ["./places-list-item.component.scss"],
})
export class PlacesListItemComponent implements OnChanges {
    @Input() place: ExtendedAreaOfInterest;
    @Input() isExpanded: boolean = false;
    numberOfExposuresText: string;
    lightConditionText: string;
    weatherAndWindText: string;
    timeRangeText: string;

    @ViewChild("expandableContainer", { static: false })
    expandableContainer: ElementRef;

    records: Array<Record> = [];

    private unloaded$ = new Subject<void>();

    constructor(private ngZone: NgZone) {}

    // TODO: test this
    // this has to update every time a configuration is updated from web app
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.place) {
            this.updateView();
        }
    }

    @HostListener("loaded")
    onLoaded(): void {
        this.subscribeToRecordChanges();
        this.updateView();
    }

    @HostListener("unloaded")
    onUnloaded() {
        this.unloaded$.next();
        this.unloaded$.complete();
    }

    private updateView(): void {
        this.updateNumberOfExposuresText();
        this.updateLightConditionText();
        this.updateWeatherAndWindText();
        this.updateTimeRangeText();
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

    // TODO: delete this
    // not used now, that's why the animation doesn't work
    toggleExpand(event: Event) {
        console.log("toggleExpand entered");
        this.isExpanded = !this.isExpanded;
        this.animateExpansion();
    }

    private animateExpansion(): void {
        console.log("animation entered");
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
                console.log("Error during animation:", e);
            });
        }
    }

    private updateNumberOfExposuresText(): void {
        this.numberOfExposuresText =
            "Nº Exposiciones: " + this.numberOfExposures;
    }

    private updateTimeRangeText(): void {
        const startTime = this.place.contextualConditions.timeRange.startTime;
        const endTime = this.place.contextualConditions.timeRange.endTime;

        const startHours = startTime.hours.toString().padStart(2, "0");
        const startMinutes = startTime.minutes.toString().padStart(2, "0");
        const endHours = endTime.hours.toString().padStart(2, "0");
        const endMinutes = endTime.minutes.toString().padStart(2, "0");

        this.timeRangeText = `Horario: De ${startHours}:${startMinutes} a ${endHours}:${endMinutes}`;
    }

    private updateLightConditionText(): void {
        this.lightConditionText =
            "Condición lumínica: " + this.getLightCondition();
    }

    private updateWeatherAndWindText(): void {
        this.weatherAndWindText =
            "Tiempo: " + this.getWeather() + " " + this.getWind();
    }

    private get numberOfExposures(): number {
        return this.records.length;
    }

    private getLightCondition(): string {
        switch (this.place.contextualConditions.lightCondition.value) {
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

    private getWind(): string {
        if (this.place.contextualConditions.isWindy) {
            return "con viento";
        } else {
            return "sin viento";
        }
    }

    private getWeather(): string {
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
}
