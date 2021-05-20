export interface Exposure {
    id?: string;
    startTime: Date;
    endTime: Date;
    emotionValues: Array<EmotionValue>;
}

export interface EmotionValue {
    timestamp: Date;
    value: number;
}
