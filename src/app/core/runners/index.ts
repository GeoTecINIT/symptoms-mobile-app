import { PlatformEvent, EventReceiver } from '../events';

export function run(taskName: string) {
    return new RunnableTask(taskName);
}

export class RunnableTask implements EventReceiver {
    interval: number;
    recurrent: boolean;
    stopEvent: string;

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
        this.stopEvent = eventName;

        return this;
    }

    exec(platformEvent?: PlatformEvent) {
        throw new Error('Not implemented');
    }
}
