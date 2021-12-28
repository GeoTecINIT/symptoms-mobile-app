import { FeedbackModalOptions } from "./options";

export const askCannotExposeFeedback: FeedbackModalOptions = {
    title: "¿No puedes exponerte ahora?",
    feedbackScreen: {
        body: {
            emoji: "👋",
            text:
                "Te esperamos en otro momento. Recuerda la importancia de exponerse",
        },
        question: "¿Podrías indicar por qué no harás una exposición?",
        options: [
            {
                type: "predefined",
                answer: "No dispongo de tiempo",
            },
            {
                type: "predefined",
                answer: "Estoy de paso",
            },
            {
                type: "free-text",
                hint: "Otro",
                helpText: "Tu terapeuta podrá leer este mensaje",
            },
        ],
    },
};

export const askWantsToLeaveFeedback: FeedbackModalOptions = {
    title: "En otro momento entonces",
    feedbackScreen: {
        body: {
            emoji: "👋",
            text:
                "Recuerda la importancia de exponerte de forma regular. Te esperamos pronto",
        },
        question: "¿Podrías indicarme el motivo de tu salida?",
        options: [
            {
                type: "predefined",
                answer: "Mi nivel de ansiedad no baja",
            },
            {
                type: "predefined",
                answer: "No dispongo de más tiempo",
            },
            {
                type: "free-text",
                hint: "Otro",
                helpText: "Tu terapeuta podrá leer este mensaje",
            },
        ],
    },
};

export const askForQuestionFrequencyFeedback: FeedbackModalOptions = {
    title: "¿Qué tal lo estamos haciendo?",
    feedbackScreen: {
        body: {
            iconCode: "\ue913",
            text:
                "Por favor, ayúdanos a mejorar respondiendo a unas cuestiones sobre la experiencia de uso de la aplicación",
        },
        question:
            "¿Cómo valorarías la frecuencia con la que recibes preguntas?",
        options: [
            {
                type: "predefined",
                answer: "Alta, recibo muchas preguntas",
            },
            {
                type: "predefined",
                answer: "Adecuada, no me resulta pesado",
            },
            {
                type: "predefined",
                answer: "Baja, podría recibir más",
            },
        ],
    },
    completionScreen: {
        body: {
            iconCode: "\ue815",
            header: "¡Gracias!",
            message: "Tus respuestas nos ayudan a mejorar",
        },
        confirmButton: "Volver a la app",
    },
};
