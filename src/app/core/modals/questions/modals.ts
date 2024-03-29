import { QuestionsModalOptions } from "./options";

export const askPreExposureQuestions: QuestionsModalOptions = {
    title: "¿Cómo te encuentras?",
    body: {
        iconCode: "\ue94c",
        text: "Responde con sinceridad a las preguntas que te planteamos",
    },
    questions: [
        {
            title: "De 0 (ninguno) a 10 (máximo), ¿cómo puntuarías tu nivel de ansiedad en este momento?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title: "De 0 (ninguna) a 10 (mucha), ¿cómo puntuarías tu capacidad para tolerar la emoción que sientes ahora?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title: "¿Qué piensas que ocurrirá cuando llegues al lugar de exposición?",
            type: "free-text",
            hint: "Pienso que...",
        },
    ],
    completionScreen: {
        body: {
            iconCode: "\ue815",
            header: "¡Adelante!",
            message: "Dirígete ahora al área de exposición",
        },
        confirmButton: "Volver a la app",
    },
};

export const askExposureQuestions: QuestionsModalOptions = {
    title: "¿Cómo te encuentras?",
    body: {
        iconCode: "\ue94c",
        text: "Responde con sinceridad a las preguntas que te planteamos",
    },
    questions: [
        {
            title: "De 0 (ninguno) a 10 (máximo), ¿cómo puntuarías tu nivel de ansiedad en este momento?",
            type: "range",
            from: 0,
            to: 10,
        },
        {
            title: "De 0 (ninguna) a 10 (mucha), ¿cómo puntuarías tu capacidad para tolerar la emoción que sientes ahora?",
            type: "range",
            from: 0,
            to: 10,
        },
    ],
};

export const askPostExposureQuestions: QuestionsModalOptions = {
    title: "¿Cómo te encuentras?",
    body: {
        iconCode: "\ue94c",
        text: "Responde con sinceridad a las preguntas que te planteamos",
    },
    questions: [
        {
            title: "¿Se ha cumplido lo que pensabas que iba a ocurrir antes de la exposición",
            type: "binary",
            left: "Sí",
            right: "No",
        },
        {
            title: "¿Has conseguido prestar atención a todo lo que estaba sucediendo alrededor de la situación de exposición?",
            type: "binary",
            left: "Sí",
            right: "No",
        },
    ],
    completionScreen: {
        body: {
            iconCode: "\ue815",
            header: "¡Buen trabajo!",
            message:
                "Sigue practicando, de esta forma tolerarás mejor esta situación",
        },
        confirmButton: "Volver a la app",
    },
};
