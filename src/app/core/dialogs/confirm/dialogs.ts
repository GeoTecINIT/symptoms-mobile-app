import { ConfirmDialogOptions } from "./options";

export const confirmToContinueExposure: ConfirmDialogOptions = {
    question: "¿Deseas continuar con la exposición o terminar por hoy?",
    positiveText: "Finalizar",
    negativeText: "Continuar",
};

export const confirmWantsToLeave: ConfirmDialogOptions = {
    question: "¿Te vas?",
    body:
        "Recuerda el papel negativo de la evitación. Es importante mantenerte en la situación hasta que consigas reducir tu nivel de ansiedad.",
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
