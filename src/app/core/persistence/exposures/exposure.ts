import { AreaOfInterest } from "@geotecinit/emai-framework/entities/aois";

export interface Exposure {
    id?: string;
    startTime: Date;
    endTime: Date;
    emotionValues: Array<EmotionValue>;
    place: AreaOfInterest;
}

export interface EmotionValue {
    timestamp: Date;
    value: number;
}
