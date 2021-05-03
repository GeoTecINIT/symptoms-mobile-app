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
    cancelConfirm?: {
        question: string;
        description?: string;
        positiveText: string;
        negativeText: string;
    };
}
