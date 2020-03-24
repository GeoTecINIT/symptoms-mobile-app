import { Task, TaskParams, setTaskDeferrer } from './task';

import { ProviderTask } from './base/provider-task';
import { GeolocationProvider } from '../providers/geolocation';
import { BatteryProvider } from '../providers/battery';

import { TaskPlanner } from './planner';
import { RunnableTaskBuilder } from './runnable-task';

export const tasks: Tasks = {
    acquireGeolocation: new ProviderTask(
        'acquireGeolocation',
        new GeolocationProvider(),
        { foreground: true }
    ),
    acquireBatteryLevel: new ProviderTask(
        'acquireBatteryLevel',
        new BatteryProvider()
    )
};

export interface Tasks {
    [key: string]: Task;
}

const taskPlanner = new TaskPlanner();
export function run(taskName: string, params: TaskParams = {}) {
    return new RunnableTaskBuilder(taskName, params, taskPlanner);
}

setTaskDeferrer((taskName, seconds, params) =>
    run(taskName, params)
        .in(seconds)
        .plan()
);
