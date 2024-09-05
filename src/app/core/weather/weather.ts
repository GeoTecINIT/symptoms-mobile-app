export enum LightCondition {
    DAY = "day",
    NIGHT = "night",
    SUNRISE = "sunrise",
    SUNSET = "sunset",
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

// Contextual conditions set by the therapist
export type ContextualConditions = {
    isWindy?: boolean;
    timeRange?: {
        startTime: {
            hours: number;
            minutes: number;
        };
        endTime: {
            hours: number;
            minutes: number;
        };
        isMandatory: boolean;
    };
    lightCondition?: {
        value: string;
        isMandatory: boolean;
    };
    weather?: Weather;
};

// Weather details got from service
export interface WeatherSummary {
    weather: Weather;
    isWindy: boolean;
    lightCondition: LightCondition;
}

// Interface for typing the OpenWeather response
export interface OpenWeatherResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: [
        {
            id: number;
            main: string;
            description: string;
            icon: string;
        }
    ];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        ground_level: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    rain?: {
        "1h"?: number;
        "3h"?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
