import { QuestionsModalOptions } from "./options";

export const askAnxietyQuestions: QuestionsModalOptions = {
    title: "¿Cómo te encuentras?",
    body: {
        iconCode: "\ue94c",
        text:
            "Por favor, responde con sinceridad. Al hacerlo me ayudas a saber mejor cómo te encuentras",
    },
    questions: [
        {
            title: "De 0 a 10, ¿cómo puntuarías tu nivel de ansiedad actual?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title:
                "De 0 a 10, ¿cómo puntuarías las ganas que tienes de salir de aquí?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title:
                "De 0 a 10, ¿cómo puntuarías tu grado de creencia en pensamientos?",
            type: "range",
            from: 0,
            to: 10,
        },
    ],
};
