import { ConfirmModalOptions } from "./options";
import { confirmWantsToLeave } from "~/app/core/dialogs/confirm";

export const confirmWantsToStartAnExposure: ConfirmModalOptions = {
    title: "Estás en un lugar importante",
    body: {
        iconCode: "\ue55f",
        text: "Has llegado a: {{aoi.name}}",
    },
    question: "¿Te animas a hacer una exposición ahora?",
    buttons: {
        confirm: "¡Claro!",
        cancel: "En otro momento",
    },
    cancelConfirmOptions: confirmWantsToLeave,
};
