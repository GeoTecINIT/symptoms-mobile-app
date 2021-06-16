import { Application } from "@nativescript/core";

const DEFAULT_EVENT_PROPAGATION_DELAY = 1000;

class AppEvents {
    triggered = new Set<string>();
    callbacks = new Map<string, Array<CallbackInfo>>();
    resumeTimeoutId: NodeJS.Timeout;
    suspendTimeoutId: NodeJS.Timeout;

    listen() {
        Application.on(Application.resumeEvent, () => {
            console.log("AppEvents: Resumed");
            this.clearShowAndHideTimeouts();
            this.resumeTimeoutId = this.delayEventPropagation(
                Application.resumeEvent
            );
        });
        Application.on(Application.suspendEvent, () => {
            console.log("AppEvents: Suspended");
            this.clearShowAndHideTimeouts();
            this.suspendTimeoutId = this.delayEventPropagation(
                Application.suspendEvent
            );
        });
        Application.on(Application.displayedEvent, () => {
            console.log("AppEvents: Displayed");
            this.clearShowAndHideTimeouts();
            this.notifyCallbacks(Application.resumeEvent);
        });
    }

    on(eventName: string, uniqueKey: string, cb: () => void) {
        const cbInfo: CallbackInfo = { cb, uniqueKey };
        if (!this.callbacks.has(eventName)) {
            this.callbacks.set(eventName, [cbInfo]);
        } else {
            const eventCallbacks = this.callbacks.get(eventName);
            if (eventCallbacks.some((info) => info.uniqueKey === uniqueKey))
                return;
            eventCallbacks.push(cbInfo);
        }

        if (this.triggered.has(eventName)) {
            cb();
            this.triggered.delete(eventName);
        }
    }

    private delayEventPropagation(eventName: string): NodeJS.Timeout {
        return setTimeout(
            (event) => {
                console.log(
                    `AppEvents: Delayed ${
                        event === Application.resumeEvent ? "resume" : "suspend"
                    }`
                );
                this.notifyCallbacks(event);
            },
            DEFAULT_EVENT_PROPAGATION_DELAY,
            eventName
        );
    }

    private notifyCallbacks(eventName: string) {
        this.triggered.add(eventName);
        if (this.callbacks.has(eventName)) {
            for (const cbInfo of this.callbacks.get(eventName)) {
                cbInfo.cb();
            }
        }
    }

    private clearShowAndHideTimeouts() {
        if (this.resumeTimeoutId) {
            clearTimeout(this.resumeTimeoutId);
            this.resumeTimeoutId = undefined;
        }
        if (this.suspendTimeoutId) {
            clearTimeout(this.suspendTimeoutId);
            this.suspendTimeoutId = undefined;
        }
    }
}

export const appEvents = new AppEvents();

interface CallbackInfo {
    cb: () => void;
    uniqueKey: string;
}
