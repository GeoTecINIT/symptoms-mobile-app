export type QuestionType = RangeQuestion; // Append other question types here

interface RangeQuestion extends Question {
    type: "range";
    from: number;
    to: number;
}

interface Question {
    title: string;
}
