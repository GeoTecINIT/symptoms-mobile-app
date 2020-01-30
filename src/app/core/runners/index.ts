import { PlatformEvent, EventReceiver } from '../events';
import { TaskPlanner } from './task-planner';

const taskPlanner = new TaskPlanner(null, null);

export function run(taskName: string) {
    return new RunnableTaskBuilder(taskName);
}

export interface RunnableTask {
    name: string;
    interval: number;
    recurrent: boolean;
    cancelEvent: string;
}

export class RunnableTaskBuilder implements EventReceiver {
    private interval: number;
    private recurrent: boolean;
    private cancelEvent: string;

    constructor(private taskName: string) {}

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
            cancelEvent: this.cancelEvent
        };
    }

    exec(platformEvent?: PlatformEvent) {
        taskPlanner
            .plan(this.build(), platformEvent)
            .then((scheduledTask) => {
                console.log(`Task planned: ${scheduledTask}`);
            })
            .catch((err) => {
                console.error(`Error while planning ${this}: ${err}`);
            });
    }
}
