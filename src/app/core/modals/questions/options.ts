export interface QuestionsModalOptions {
    title: string;
    body: {
        emoji?: string;
        iconCode?: string;
        text: string;
    };
    questions: Array<QuestionType>;
}

export type QuestionType = RangeQuestion; // Append other question types here

interface RangeQuestion extends Question {
    type: "range";
    from: number;
    to: number;
}

interface Question {
    title: string;
}
