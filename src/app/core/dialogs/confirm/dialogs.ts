import { ConfirmDialogOptions } from "./options";

export const confirmFeelsBetter: ConfirmDialogOptions = {
    question: "¿Te sientes mejor?",
    positiveText: "Sí",
    negativeText: "No",
};

export const confirmWantsToLeave: ConfirmDialogOptions = {
    question: "¿Te vas?",
    body:
        "No deberías abandonar una exposición salvo por causa mayor. Recuerda el papel negativo de la evitación. Es normal que tengas picos de ansiedad. Si te quedas, acabarás controlándolos.",
    positiveText: "Me quedo",
    negativeText: "Salir",
};

export const confirmWantsToUnlink: ConfirmDialogOptions = {
    question: "¿Desvincular dispositivo?",
    body:
        "Si desvinculas este dispositivo perderás todo el progreso almacenado localmente (p. ej. contenido psicoeducativo visto, etc.) y tendrás que volver a configurar la app en caso de reinstalación",
    positiveText: "Salir",
    negativeText: "Volver",
};
