import { ConfirmModalOptions } from "./options";
import {
    confirmToDiscardExposure,
    confirmWantsToLeave,
} from "~/app/core/dialogs/confirm";

export const confirmPretendsToStartAnExposure: ConfirmModalOptions = {
    title: "Estás cerca de un lugar de exposición",
    body: {
        iconCode: "\ue55f",
        text: "Estás cerca de: {{0.aoi.name}}",
    },
    question: "¿Vas a hacer una exposición?",
    buttons: {
        confirm: "Sí",
        cancel: "En otro momento",
    },
    cancelConfirmOptions: confirmToDiscardExposure,
};

export const confirmWantsToStartAnExposure: ConfirmModalOptions = {
    title: "Estás en un lugar de exposición",
    body: {
        iconCode: "\ue55f",
        text: "Has llegado a: {{0.aoi.name}}",
    },
    question: "¿Te animas a hacer una exposición ahora?",
    buttons: {
        confirm: "¡Claro!",
        cancel: "En otro momento",
    },
    cancelConfirmOptions: confirmWantsToLeave,
};

export const confirmDidNotLeaveAreaOnPurpose: ConfirmModalOptions = {
    title: "¿Estás saliendo del área?",
    body: {
        iconCode: "\ue575",
        text:
            "Hemos detectado que has salido del área. Si no ha sido algo voluntario, no te preocupes.",
    },
    question: "¿Has salido del área de exposición?",
    buttons: {
        confirm: "No",
        cancel: "Sí",
    },
};
