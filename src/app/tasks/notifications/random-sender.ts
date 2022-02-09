import { NotificationSenderTask } from "@geotecinit/emai-framework/internal/tasks/notifications/notification-sender";
import { TracerConfig } from "@geotecinit/emai-framework/internal/tasks/tracing";
import {
    notificationsManager,
    NotificationsManager,
} from "@geotecinit/emai-framework/internal/notifications/manager";
import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
} from "@geotecinit/emai-framework/tasks";
import { TapAction } from "@geotecinit/emai-framework/internal/notifications";

export class RandomNotificationSenderTask extends NotificationSenderTask {
    constructor(
        name: string,
        taskConfig?: TracerConfig,
        manager: NotificationsManager = notificationsManager
    ) {
        super(name, taskConfig, manager);
    }

    protected onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const { options, defaultTapAction } = taskParams;
        if (!Array.isArray(options)) {
            throw new Error(
                "An array of notification options must be included as a task parameter"
            );
        }
        const newParams = RandomNotificationSenderTask.pickOneNotificationFrom(
            options,
            defaultTapAction
        );

        return super.onTracedRun(newParams, invocationEvent);
    }

    private static pickOneNotificationFrom(
        options: Array<BasicNotification>,
        defaultTapAction: TapAction
    ): TaskParams {
        if (options.length === 0) {
            throw new Error(
                "At least one notification option must be included as a task parameter"
            );
        }

        const index = Math.floor(Math.random() * options.length);
        const chosenNotification = options[index];

        if (!chosenNotification.title) {
            throw new Error("Each notification option must include a title");
        }

        return {
            ...chosenNotification,
            tapAction: chosenNotification.tapAction ?? defaultTapAction,
        };
    }
}

interface BasicNotification {
    title: string;
    body?: string;
    tapAction?: TapAction;
}
