import { ConfirmModalOptions } from "./options";
import { embedModel } from "~/app/core/utils/strings";

export class ConfirmModalOptionsDataEmbedder {
    constructor(private optionsTemplate: ConfirmModalOptions) {}

    embed(data: any): ConfirmModalOptions {
        const { title, body, question } = this.optionsTemplate;

        return {
            ...this.optionsTemplate,
            title: embedModel(title, data),
            body: {
                ...body,
                text: embedModel(body.text, data),
            },
            question: embedModel(question, data),
        };
    }
}
