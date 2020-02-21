import { PlannedTasksStore } from '~/app/core/persistence/planned-tasks-store';

import { PlannedTask } from '~/app/core/tasks/planner/planned-task';
import { RunnableTask } from '~/app/core/tasks/runnable-task';

export function createPlannedTaskStoreMock(): PlannedTasksStore {
    return {
        insert(plannedTask: PlannedTask) {
            return Promise.resolve();
        },
        delete(task: string) {
            return Promise.resolve();
        },
        get(task: RunnableTask | string) {
            return Promise.resolve(null);
        },
        getAllSortedByNextRun() {
            return Promise.resolve([]);
        },
        getAllFilteredByCancelEvent(eventName: string) {
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
