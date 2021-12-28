export interface QuestionsModalOptions {
    title: string;
    body: {
        emoji?: string;
        iconCode?: string;
        text: string;
    };
    questions: Array<QuestionType>;
}

export type QuestionType = RangeQuestion | FreeTextQuestion; // Append other question types here

interface Question {
    title: string;
}

interface RangeQuestion extends Question {
    type: "range";
    from: number;
    to: number;
}

interface FreeTextQuestion extends Question {
    type: "free-text";
    hint?: string;
    helpText?: string;
}
