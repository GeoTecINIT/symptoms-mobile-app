import { PlatformEvent, EventReceiver } from '../events';
import { TaskPlanner } from './task-planner';

const taskPlanner = new TaskPlanner(null, null);

export function run(taskName: string) {
    return new RunnableTask(taskName);
}

export class RunnableTask implements EventReceiver {
    interval: number;
    recurrent: boolean;
    cancelEvent: string;

    constructor(public taskName: string) {}

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

    exec(platformEvent?: PlatformEvent) {
        taskPlanner
            .plan(this, platformEvent)
            .then((scheduledTask) => {
                console.log(`Task planned: ${scheduledTask}`);
            })
            .catch((err) => {
                console.error(`Error while planning ${this}: ${err}`);
            });
    }
}
