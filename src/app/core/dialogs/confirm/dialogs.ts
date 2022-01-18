import { ConfirmDialogOptions } from "./options";

export const confirmWantsToMakeEmergencyCall: ConfirmDialogOptions = {
    question: "Utiliza esta opción solo si crees que necesitas ayuda",
    body:
        "Si has pulsado aquí por error, selecciona CANCELAR. En caso contrario, pulsa CONTINUAR",
    positiveText: "Cancelar",
    negativeText: "Continuar",
};

export const confirmToDiscardExposure: ConfirmDialogOptions = {
    question: "¿Te vas?",
    body:
        "Puedes realizar una exposición en otro momento. Recuerda que exponerse con frecuencia es la mejor forma de mejorar.",
    positiveText: "Exponerme",
    negativeText: "Salir",
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

export const confirmWantsToExport: ConfirmDialogOptions = {
    question: "¿Exportar todos los datos recopilados por la app?",
    body:
        "El proceso puede llevar un tiempo en función del uso que hayas hecho de la app y del tiempo que lleves usándola",
    positiveText: "Exportar",
    negativeText: "Cancelar",
};
