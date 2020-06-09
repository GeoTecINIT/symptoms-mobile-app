import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
import { toSeconds } from "nativescript-task-dispatcher/utils/time-converter";

import { ProviderTask } from "../core/tasks/base/provider-task";
import { GeolocationProvider } from "../core/providers/geolocation";
import { BatteryProvider } from "../core/providers/battery";

import { LogTaskExecutionStart } from "../experiment/log-execution-start-task";
import { logExecutionEndTask } from "../experiment/log-execution-end-task";
import { ExperimentTask } from "../experiment/experiment-tasks";

export const appTasks: Array<Task> = [
    new ProviderTask("acquireGeolocation", new GeolocationProvider(), {
        foreground: true,
    }),
    new ProviderTask("acquireBatteryLevel", new BatteryProvider()),
    new LogTaskExecutionStart(ExperimentTask.Dummy),
    new LogTaskExecutionStart(ExperimentTask.GPS),
    logExecutionEndTask,
    new SimpleTask("fastTask", async ({ log }) => log("Fast task run!")),
    new SimpleTask(
        "mediumTask",
        ({ log, onCancel }) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    log("Medium task run!");
                    resolve();
                }, 2000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            })
    ),
    new SimpleTask(
        "slowTask",
        ({ log, onCancel }) =>
            new Promise((resolve) => {
                const timeoutId = setTimeout(() => {
                    log("Slow task run!");
                    resolve();
                }, 30000);
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });
            }),
        { foreground: true }
    ),
    new SimpleTask("printGeolocation", async ({ log, evt }) => {
        log(`Last location: ${JSON.stringify(evt.data.record)}`);
    }),
    new SimpleTask("incrementalTask", async ({ params, log, runAgainIn }) => {
        const execCount = params.execCount ? params.execCount : 1;
        const execTime = toSeconds(execCount, "minutes");
        log(`Incremental task: Task run after ${execTime} seconds`);
        runAgainIn(toSeconds(execCount + 1, "minutes"), {
            execCount: execCount + 1,
        });
    }),
];
