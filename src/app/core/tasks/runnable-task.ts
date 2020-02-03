import { TaskParams } from './task';
import { EventReceiver, PlatformEvent } from '../events';
import { TaskPlanner } from './planner';

export interface RunnableTask {
    name: string;
    interval: number;
    recurrent: boolean;
    params: TaskParams;
    cancelEvent?: string;
}

export class RunnableTaskBuilder implements EventReceiver {
    private interval: number;
    private recurrent: boolean;
    private cancelEvent: string;

    constructor(
        private taskName: string,
        private params: TaskParams,
        private taskPlanner?: TaskPlanner
    ) {}

    now() {
        this.interval = 0;
        this.recurrent = false;

        return this;
    }

    every(seconds: number) {
        this.interval = seconds;
        this.recurrent = true;

        return this;
    }

    in(seconds: number) {
        this.interval = seconds;
        this.recurrent = false;

        return this;
    }

    cancelOn(eventName: string) {
        this.cancelEvent = eventName;

        return this;
    }

    build(): RunnableTask {
        return {
            name: this.taskName,
            interval: this.interval,
            recurrent: this.recurrent,
            cancelEvent: this.cancelEvent,
            params: this.params
        };
    }

    onReceive(platformEvent?: PlatformEvent) {
        const runnableTask = this.build();
        this.taskPlanner
            .plan(runnableTask, platformEvent)
            .then((plannedTask) => {
                console.log(`Task planned: ${plannedTask}`);
            })
            .catch((err) => {
                console.error(
                    `Error while planning ${JSON.stringify(
                        runnableTask
                    )}: ${err}`
                );
            });
    }
}
