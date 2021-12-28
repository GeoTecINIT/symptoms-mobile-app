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
    confirmPretendsToStartAnExposure,
    confirmWantsToStartAnExposure,
} from "~/app/core/modals/confirm";
import {
    askCannotExposeFeedback,
    askWantsToLeaveFeedback,
} from "~/app/core/modals/feedback";
import {
    askExposureQuestions,
    askPostExposureQuestions,
    askPreExposureQuestions,
} from "~/app/core/modals/questions";
import {
    emitExposureStartConfirmedEvent,
    emitPreExposureStartConfirmedEvent,
} from "~/app/core/framework/events";

@Injectable({
    providedIn: "root",
})
export class NotificationsHandlerService {
    private logger: Logger;
    private savedNotification: Notification;

    constructor(
        private confirmModalService: ConfirmModalService,
        private feedbackModalService: FeedbackModalService,
        private questionsModalService: QuestionsModalService,
        private contentViewModalService: ContentViewModalService
    ) {
        this.logger = getLogger("NotificationsHandlerService");
    }

    resume() {
        this.setNotificationTapCallback((notification) =>
            this.handle(notification)
        );
        this.setNotificationClearCallback((notification) => {
            this.logger.info(`Notification with id ${notification.id} cleared`);
        });

        if (this.savedNotification) {
            this.logger.debug("There was a notification saved");
            this.handle(this.savedNotification).catch((e) => {
                this.logger.error(
                    `Could not handle notification tap: Reason ${e}`
                );
            });
            this.savedNotification = undefined;
        }
    }

    pause() {
        this.setNotificationTapCallback((notification) => {
            this.logger.debug("Saving notification for later");
            this.savedNotification = notification;
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

    private setNotificationTapCallback(
        cb: (notification: Notification) => void
    ) {
        notificationsManager.onNotificationTap(cb).catch((e) => {
            this.logger.error(`Error in notifications callback. Reason: ${e}`);
        });
    }

    private setNotificationClearCallback(
        cb: (notification: Notification) => void
    ) {
        notificationsManager.onNotificationCleared(cb).catch((e) => {
            this.logger.error(
                `Could not setup notification discard callback. Reason: ${e}`
            );
        });
    }

    private async handleConfirmAction(notification: Notification) {
        const tapActionId = notification.tapAction.id;
        const { metadata } = notification.tapAction;
        switch (tapActionId) {
            case "exposure-intention":
                const pretendsToStartExposure = await this.showConfirmModal(
                    new ConfirmModalOptionsDataEmbedder(
                        confirmPretendsToStartAnExposure
                    ).embed(metadata),
                    notification
                );
                if (!pretendsToStartExposure) {
                    await this.showFeedbackModal(
                        askCannotExposeFeedback,
                        notification
                    );
                } else {
                    emitPreExposureStartConfirmedEvent(metadata);
                }
                break;
            case "start-exposure":
                const wantsToStartExposure = await this.showConfirmModal(
                    new ConfirmModalOptionsDataEmbedder(
                        confirmWantsToStartAnExposure
                    ).embed(metadata),
                    notification
                );
                if (!wantsToStartExposure) {
                    await this.showFeedbackModal(
                        askWantsToLeaveFeedback,
                        notification
                    );
                } else {
                    emitExposureStartConfirmedEvent(metadata);
                }
                break;
            default:
                throw new Error(`Unsupported confirm action: ${tapActionId}`);
        }
    }

    private async handleFeedbackAction(notification: Notification) {
        const tapActionId = notification.tapAction.id;
        let options: FeedbackModalOptions;
        switch (tapActionId) {
            case "exposure-discarded":
                options = askCannotExposeFeedback;
                break;
            case "exposure-left":
                options = askWantsToLeaveFeedback;
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
            case "pre-exposure-questions":
                options = askPreExposureQuestions;
                break;
            case "exposure-questions":
                options = askExposureQuestions;
                break;
            case "post-exposure-questions":
                options = askPostExposureQuestions;
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
