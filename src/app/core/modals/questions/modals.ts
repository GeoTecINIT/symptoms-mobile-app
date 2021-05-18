import { QuestionsModalOptions } from "./options";

export const askAnxietyQuestions: QuestionsModalOptions = {
    title: "¿Cómo te encuentras?",
    body: {
        iconCode: "\ue94c",
        text: "Responde con sinceridad a las preguntas que te planteamos",
    },
    questions: [
        {
            title:
                "De 0 a 10, ¿cómo puntuarías tu nivel de ansiedad en este momento?",
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
                "De 0 a 10, ¿cómo puntuarías el grado de creencia en los pensamientos que tienes acerca de esta situación?",
            type: "range",
            from: 0,
            to: 10,
        },
    ],
};
