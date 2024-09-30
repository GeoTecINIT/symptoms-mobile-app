import { FeedbackModalOptions } from "./options";

export const askCannotExposeFeedback: FeedbackModalOptions = {
    title: "¿No puedes exponerte ahora?",
    feedbackScreen: {
        body: {
            emoji: "👋",
            text: "Te esperamos en otro momento. Recuerda la importancia de exponerse",
        },
        question: "¿Podrías indicar por qué no harás una exposición?",
        options: [
            {
                type: "predefined",
                answer: "No dispongo de tiempo",
                // answer: "He finalizado la exposición",
            },
            {
                type: "predefined",
                answer: "Estoy de paso",
                // answer: "Tengo demasiado malestar y necesito tomar un respiro, pero después volveré a exponerme",
            },
            // {
            //     type: "predefined",
            //     // answer: "Estoy de paso",
            //     answer: "Quiero dejar la situación, en estos momentos es muy difícil para mí",
            // },
            {
                type: "free-text-with-audio",
                hint: "Otros motivos",
                helpText: "Tu terapeuta podrá leer este mensaje",
            },
        ],
    },
};

export const askWantsToLeaveFeedback: FeedbackModalOptions = {
    title: "Entendemos que pueda ser difícil exponerte",
    feedbackScreen: {
        body: {
            emoji: "👋",
            text: "Recuerda la importancia de exponerte de forma regular. Te esperamos pronto",
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
                type: "free-text-with-audio",
                hint: "Otro",
                helpText: "Tu terapeuta podrá leer este mensaje",
            },
        ],
    },
};
