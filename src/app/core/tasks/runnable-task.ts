import { TaskParams } from './task';
import { EventReceiver, PlatformEvent } from '../events';
import { TaskPlanner } from './planner';
import { TimeUnit, toSeconds } from '../utils/time-converter';

// TODO: Update once a real default cancel event exists!
const DEFAULT_CANCEL_EVENT = 'unknown';

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
    ) {
        this.interval = 0;
        this.recurrent = false;
        this.cancelEvent = DEFAULT_CANCEL_EVENT;
    }

    now() {
        this.interval = 0;
        this.recurrent = false;

        return this;
    }

    every(time: number, timeUnit?: TimeUnit) {
        const seconds = timeUnit ? toSeconds(time, timeUnit) : time;
        this.interval = seconds;
        this.recurrent = true;

        return this;
    }

    in(time: number, timeUnit?: TimeUnit) {
        const seconds = timeUnit ? toSeconds(time, timeUnit) : time;
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

    plan(platformEvent?: PlatformEvent) {
        const runnableTask = this.build();
        this.taskPlanner
            .plan(runnableTask, platformEvent)
            .then((plannedTask) => {
                console.log(
                    `Task successfully planned: ${JSON.stringify(plannedTask)}`
                );
            })
            .catch((err) => {
                console.error(
                    `Error while planning ${JSON.stringify(
                        runnableTask
                    )}: ${err}`
                );
            });
    }

    onReceive(platformEvent: PlatformEvent) {
        this.plan(platformEvent);
    }
}
