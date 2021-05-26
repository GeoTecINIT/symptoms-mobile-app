import { Injectable } from "@angular/core";
import { ConfirmModalOptions, ConfirmModalService } from "./modals/confirm";
import {
    QuestionAnswer,
    QuestionsModalOptions,
    QuestionsModalService,
} from "./modals/questions";
import { FeedbackModalOptions, FeedbackModalService } from "./modals/feedback";
import { ContentViewModalService } from "./modals/content-view";

import { getLogger, Logger } from "~/app/core/utils/logger";
import {
    Notification,
    notificationsManager,
    TapActionType,
} from "@geotecinit/emai-framework/notifications";

import {
    ConfirmModalOptionsDataEmbedder,
    confirmWantsToStartAnExposure,
} from "~/app/core/modals/confirm";
import {
    askForQuestionFrequencyFeedback,
    askWantsToLeaveFeedback,
} from "~/app/core/modals/feedback";
import { askAnxietyQuestions } from "~/app/core/modals/questions";
import { emitExposureStartConfirmedEvent } from "~/app/core/framework/events";

@Injectable({
    providedIn: "root",
})
export class NotificationsHandlerService {
    private confirmModalService: ConfirmModalService;
    private feedbackModalService: FeedbackModalService;
    private questionsModalService: QuestionsModalService;
    private contentViewModalService: ContentViewModalService;

    private logger: Logger;

    constructor() {
        this.logger = getLogger("NotificationsHandlerService");
    }

    // Fixme: make modal services global so cyclic dependencies become removed
    // and then services can be injected via constructor instead.
    init(
        confirmModalService: ConfirmModalService,
        feedbackModalService: FeedbackModalService,
        questionsModalService: QuestionsModalService,
        contentViewModalService: ContentViewModalService
    ) {
        this.confirmModalService = confirmModalService;
        this.feedbackModalService = feedbackModalService;
        this.questionsModalService = questionsModalService;
        this.contentViewModalService = contentViewModalService;

        notificationsManager
            .onNotificationTap((notification) => this.handle(notification))
            .catch((e) => {
                this.logger.error(
                    `Error in notifications callback. Reason: ${e}`
                );
            });

        notificationsManager
            .onNotificationCleared((notification) => {
                this.logger.info(
                    `Notification with id ${notification.id} cleared`
                );
            })
            .catch((e) => {
                this.logger.error(
                    `Could not setup notification discard callback. Reason: ${e}`
                );
            });
    }

    handle(notification: Notification): Promise<void> {
        switch (notification.tapAction.type) {
            case "ask-confirmation":
                return this.handleConfirmAction(notification);
            case TapActionType.ASK_FEEDBACK:
                return this.handleFeedbackAction(notification);
            case TapActionType.DELIVER_QUESTIONS:
                return this.handleQuestionsAction(notification);
            case TapActionType.OPEN_CONTENT:
                return this.handleContentAction(notification);
            default:
                return this.markAsSeen(notification);
        }
    }

    private async handleConfirmAction(notification: Notification) {
        const tapActionId = notification.tapAction.id;
        if (tapActionId !== "start-exposure") {
            throw new Error(`Unsupported confirm action: ${tapActionId}`);
        }
        const { metadata } = notification.tapAction;
        const wantsToStartExposure = await this.showConfirmModal(
            new ConfirmModalOptionsDataEmbedder(
                confirmWantsToStartAnExposure
            ).embed(metadata),
            notification
        );
        if (!wantsToStartExposure) {
            await this.showFeedbackModal(askWantsToLeaveFeedback, notification);
        } else {
            emitExposureStartConfirmedEvent(metadata);
        }
    }

    private async handleFeedbackAction(notification: Notification) {
        const tapActionId = notification.tapAction.id;
        let options: FeedbackModalOptions;
        switch (tapActionId) {
            case "exposure-left":
                options = askWantsToLeaveFeedback;
                break;
            case "question-frequency":
                options = askForQuestionFrequencyFeedback;
                break;
            default:
                throw new Error(`Unsupported feedback action: ${tapActionId}`);
        }
        await this.showFeedbackModal(options, notification);
    }

    private async handleQuestionsAction(notification: Notification) {
        const questionnaireId = notification.tapAction.id;
        let options: QuestionsModalOptions;
        switch (questionnaireId) {
            case "anxiety-questions":
                options = askAnxietyQuestions;
                break;
            default:
                throw new Error(`Unknown questionnaire: ${questionnaireId}`);
        }
        await this.showQuestionsModal(options, notification);
    }

    private async handleContentAction(notification: Notification) {
        const tapActionId = notification.tapAction.id;
        await this.showContentModal(tapActionId, notification);
    }

    private async showConfirmModal(
        options: ConfirmModalOptions,
        notification: Notification
    ): Promise<boolean | void> {
        try {
            const result = await this.confirmModalService.show(options);
            this.logger.debug(`Result: ${result}`);
            if (result !== undefined) {
                await this.markAsSeen(notification);
            }

            return result;
        } catch (e) {
            this.logger.error(
                `Could not show confirm modal (id=${notification.tapAction.id}): ${e}`
            );
        }
    }

    private async showFeedbackModal(
        options: FeedbackModalOptions,
        notification: Notification
    ): Promise<string | void> {
        try {
            const feedback = await this.feedbackModalService.askFeedback(
                notification.tapAction.id,
                options,
                notification.id
            );
            await this.markAsSeen(notification);

            return feedback;
        } catch (e) {
            this.logger.error(
                `Could not deliver feedback (id=${notification.tapAction.id}): ${e}`
            );
        }
    }

    private async showQuestionsModal(
        options: QuestionsModalOptions,
        notification: Notification
    ): Promise<Array<QuestionAnswer> | void> {
        try {
            const answers = await this.questionsModalService.deliverQuestions(
                notification.tapAction.id,
                options,
                notification.id
            );
            if (answers !== undefined) {
                await this.markAsSeen(notification);
            }

            return answers;
        } catch (e) {
            this.logger.error(
                `Could not deliver questions (id=${notification.tapAction.id}): ${e}`
            );
        }
    }

    private async showContentModal(
        id: string,
        notification: Notification
    ): Promise<void> {
        try {
            await this.contentViewModalService.showContent(id);
            await this.markAsSeen(notification);
        } catch (e) {
            this.logger.error(`Could not show content (id=${id}): ${e}`);
        }
    }

    private async markAsSeen({ id }: Notification) {
        try {
            await notificationsManager.markAsSeen(id);
        } catch (e) {
            this.logger.error(
                `Could not make notification (id=${id}) as seen. Reason: ${e}`
            );
        }
    }
}
