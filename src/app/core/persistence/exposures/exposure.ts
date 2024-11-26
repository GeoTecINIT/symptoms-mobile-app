import { AreaOfInterest } from "@awarns/geofencing";
import { ContextualConditions, WeatherSummary } from "../../weather";

export interface Exposure {
    id?: string;
    startTime?: Date;
    endTime?: Date;
    place: AreaOfInterest;
    emotionValues: Array<EmotionValue>;
    successful: boolean;
    weatherSummary?: WeatherSummary;
    contextualConditions?: ContextualConditions;
}

export interface EmotionValue {
    timestamp: Date;
    value: number;
}
