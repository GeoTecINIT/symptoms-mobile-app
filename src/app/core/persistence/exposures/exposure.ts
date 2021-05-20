export interface Exposure {
    id?: string;
    startTime: Date;
    endTime: Date;
    emotionValues: Array<EmotionValues>;
}

interface EmotionValues {
    timestamp: Date;
    value: number;
}
