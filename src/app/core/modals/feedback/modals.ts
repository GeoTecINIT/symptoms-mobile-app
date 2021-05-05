import { FeedbackModalOptions } from "./options";

export const askWantsToLeaveFeedback: FeedbackModalOptions = {
    title: "En otro momento entonces",
    feedbackScreen: {
        body: {
            emoji: "👋",
            text:
                "No te preocupes, lo importante es ser constante. ¡Hasta pronto!",
        },
        question: "¿Podrías indicar el motivo de tu salida?",
        options: [
            {
                type: "predefined",
                answer: "Mi nivel de ansiedad no baja",
            },
            {
                type: "predefined",
                answer: "No consigo manejar la situación",
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
    confirmScreen: {
        body: {
            iconCode: "\ue815",
            header: "¡Gracias!",
            message: "Tus respuestas nos ayudan a mejorar",
        },
        confirm: "Volver a la app",
    },
};
