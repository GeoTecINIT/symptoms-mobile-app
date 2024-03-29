import { AreaOfInterest } from "@awarns/geofencing";

export interface Exposure {
    id?: string;
    startTime?: Date;
    endTime?: Date;
    place: AreaOfInterest;
    emotionValues: Array<EmotionValue>;
    successful: boolean;
}

export interface EmotionValue {
    timestamp: Date;
    value: number;
}
