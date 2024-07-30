import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { getConfig } from "~/app/core/config";
import { LightCondition, OpenWeatherResponse, WeatherSummary } from "./weather";
import { getLogger, Logger } from "~/app/core/utils/logger";

// Threshold to determine if the day is windy or not. (Units m/s)
const WINDY_THRESHOLD = 5;

// Offset for calculating if time is close to sunrise or sunset (unix timestamp UTC)
const TWILIGHT_OFFSET = 1800;

@Injectable({
    providedIn: "root",
})
export class WeatherService {
    private logger: Logger;

    private apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    private apiKey: string;

    constructor(private http: HttpClient) {
        this.apiKey = getConfig().openWeatherApiKey;
        this.logger = getLogger("WeatherService");
    }

    private getWeather(lat: number, lon: number): Promise<OpenWeatherResponse> {
        return firstValueFrom(
            this.http.get<OpenWeatherResponse>(
                `${this.apiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
            )
        );
    }

    private getLightCondition(
        sunrise: number,
        sunset: number,
        localTime: number
    ): LightCondition {
        if (
            localTime >= sunrise - TWILIGHT_OFFSET &&
            localTime < sunrise + TWILIGHT_OFFSET
        )
            return LightCondition.SUNRISE;
        if (
            localTime >= sunrise + TWILIGHT_OFFSET &&
            localTime < sunset - TWILIGHT_OFFSET
        )
            return LightCondition.DAY;
        if (
            localTime >= sunset - TWILIGHT_OFFSET &&
            localTime < sunset + TWILIGHT_OFFSET
        )
            return LightCondition.SUNSET;
        return LightCondition.NIGHT;
    }

    getContextualInformation(
        lat: number,
        lon: number
    ): Promise<WeatherSummary | undefined> {
        return this.getWeather(lat, lon)
            .then((res) => {
                return {
                    weather: res.weather[0].main,
                    isWindy: res.wind.speed > WINDY_THRESHOLD,
                    lightCondition: this.getLightCondition(
                        res.sys.sunrise,
                        res.sys.sunset,
                        res.dt
                    ),
                } as WeatherSummary;
            })
            .catch((err) => {
                this.logger.error(
                    `Could not get the weather info. Reason: ${err}`
                );
                return undefined;
            });
    }
}
