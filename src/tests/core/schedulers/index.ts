import { ScheduledTasksStore } from '~/app/core/schedulers/scheduled-tasks-store';

import {
    ScheduledTask,
    TaskToSchedule
} from '~/app/core/schedulers/scheduled-task';

export function createScheduledTaskStoreMock(): ScheduledTasksStore {
    return {
        insert(scheduledTask: ScheduledTask) {
            return Promise.resolve();
        },
        delete(task: string) {
            return Promise.resolve();
        },
        get(task: TaskToSchedule | string) {
            return Promise.resolve(null);
        },
        getAllSortedByInterval() {
            return Promise.resolve([]);
        },
        increaseErrorCount(task: string) {
            return Promise.resolve();
        },
        increaseTimeoutCount(task: string) {
            return Promise.resolve();
        },
        updateLastRun(task: string, timestamp: number) {
            return Promise.resolve();
        }
    };
}
