export interface QuestionStepResult extends BaseAnswer {
    step: number;
}

export interface QuestionAnswer extends BaseAnswer {
    title: string;
}

interface BaseAnswer {
    answer: any;
    answerTime: Date;
}
