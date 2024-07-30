import { ConfirmDialogOptions } from "~/app/core/dialogs/confirm";
import { ContextualConditions, WeatherSummary } from "~/app/core/weather";

export interface ConfirmModalOptions {
    title: string;
    body: {
        emoji?: string;
        iconCode?: string;
        text: string;
    };
    question: string;
    buttons: {
        confirm: string;
        cancel: string;
    };
    negative: boolean;
    cancelConfirmOptions?: ConfirmDialogOptions;
    contextualConditions?: ContextualConditions;
    weatherSummary?: WeatherSummary;
}
