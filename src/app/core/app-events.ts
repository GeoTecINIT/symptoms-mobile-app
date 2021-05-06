import { Application } from "@nativescript/core";

class AppEvents {
    triggered = new Set<string>();
    callbacks = new Map<string, Array<() => void>>();

    listen() {
        Application.on(Application.displayedEvent, () => {
            const displayedEvent = Application.displayedEvent;
            this.triggered.add(displayedEvent);
            if (this.callbacks.has(displayedEvent)) {
                for (const cb of this.callbacks.get(displayedEvent)) {
                    cb();
                }
                this.callbacks.clear();
            }
        });
    }

    once(eventName, cb: () => void) {
        if (this.triggered.has(eventName)) {
            cb();

            return;
        }
        if (!this.callbacks.has(eventName)) {
            this.callbacks.set(eventName, [cb]);
        } else {
            this.callbacks.get(eventName).push(cb);
        }
    }
}

export const appEvents = new AppEvents();
