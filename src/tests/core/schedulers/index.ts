import { ScheduledTasksStore } from '~/app/core/schedulers/scheduled-tasks-store';

import { ScheduledTask } from '~/app/core/schedulers/scheduled-task';
import { RunnableTask } from '~/app/core/runners/runnable-task';

export function createScheduledTaskStoreMock(): ScheduledTasksStore {
    return {
        insert(scheduledTask: ScheduledTask) {
            return Promise.resolve();
        },
        delete(task: string) {
            return Promise.resolve();
        },
        get(task: RunnableTask | string) {
            return Promise.resolve(null);
        },
        getAllSortedByInterval() {
            return Promise.resolve([]);
        },
        increaseErrorCount(taskId: string) {
            return Promise.resolve();
        },
        increaseTimeoutCount(taskId: string) {
            return Promise.resolve();
        },
        updateLastRun(taskId: string, timestamp: number) {
            return Promise.resolve();
        }
    };
}
