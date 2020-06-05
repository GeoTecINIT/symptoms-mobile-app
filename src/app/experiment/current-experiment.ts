import {
    getString,
    setString,
    getNumber,
    setNumber,
    remove,
} from "tns-core-modules/application-settings";

import { taskDispatcher } from "nativescript-task-dispatcher";

import { Experiment } from "./experiment";

const CURRENT_EXPERIMENT_NAME = "CURRENT_EXPERIMENT_NAME";
const CURRENT_EXPERIMENT_DATE = "CURRENT_EXPERIMENT_DATE";

const FILE_EXT = ".csv";

class CurrentExperiment {
    private name = getString(CURRENT_EXPERIMENT_NAME, "");
    private timestamp = getNumber(CURRENT_EXPERIMENT_DATE, -1);

    start(name: string) {
        if (name.trim() === "" && !this.get().isRunning) {
            return;
        }

        this.setName(name);
        this.setTimestamp(new Date());

        this.emitStartEvent();

        return this.get();
    }

    finish() {
        this.clear();

        this.emitStopEvent();

        return this.get();
    }

    get(): Experiment {
        if (this.name === "") {
            return {
                isRunning: false,
                name: "",
            };
        }

        return {
            isRunning: true,
            name: this.name,
            startedAt: new Date(this.timestamp),
        };
    }

    getLogFileName(): string {
        const currExp = this.get();
        if (!currExp.isRunning) {
            throw new Error("No experiment is running!");
        }

        return `${currExp.name}_${formatDate(currExp.startedAt)}${FILE_EXT}`;
    }

    // FIXME: This has to be better handled with a view informing the user
    // about the permissions to be asked
    private async emitStartEvent() {
        const isReady = await taskDispatcher.isReady();
        if (!isReady) {
            await taskDispatcher.prepare();
        }
        taskDispatcher.emitEvent("startEvent");
    }

    private emitStopEvent() {
        taskDispatcher.emitEvent("stopEvent");
    }

    private setName(name: string) {
        this.name = name;
        setString(CURRENT_EXPERIMENT_NAME, name);
    }

    private setTimestamp(date: Date) {
        const timestamp = date.getTime();
        this.timestamp = timestamp;
        setNumber(CURRENT_EXPERIMENT_DATE, timestamp);
    }

    private clear() {
        this.name = "";
        remove(CURRENT_EXPERIMENT_NAME);
        this.timestamp = -1;
        remove(CURRENT_EXPERIMENT_DATE);
    }
}

function formatDate(d: Date) {
    const day = twoDigitFormat(d.getDate());
    const month = twoDigitFormat(d.getMonth() + 1);
    const year = d.getFullYear();

    const hours = twoDigitFormat(d.getHours());
    const minutes = twoDigitFormat(d.getMinutes());

    return `${day}-${month}-${year}T${hours}h${minutes}`;
}

function twoDigitFormat(num: number): string {
    return ("0" + num).slice(-2);
}

export const currentExperiment = new CurrentExperiment();
