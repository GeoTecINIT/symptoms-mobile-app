import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { PlannedTask } from '../planner/planned-task';
import { getTask } from '../provider';
import { Task, TaskParams } from '../task';
import { PlatformEvent, on, CoreEvent, off } from '../../events';

export class SingleTaskRunner {
    constructor(private taskStore: PlannedTasksStore) {}

    async run(
        plannedTask: PlannedTask,
        timeoutId: string,
        platformEvent?: PlatformEvent
    ): Promise<void> {
        const { name, id, params } = plannedTask;
        const task = getTask(name);

        await this.taskStore.updateLastRun(id, new Date().getTime());

        try {
            const parameterizedTask = new ParameterizedTask(
                task,
                params,
                platformEvent
            );
            await this.runWithTimeout(id, parameterizedTask, timeoutId);
        } catch (error) {
            await this.taskStore.increaseErrorCount(id);
        }
    }

    private runWithTimeout(
        id: string,
        task: ParameterizedTask,
        timeoutId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const listenerId = on(CoreEvent.TaskExecutionTimedOut, (evt) => {
                if (evt.id === timeoutId) {
                    task.cancel();
                    this.taskStore
                        .increaseTimeoutCount(id)
                        .then(() => resolve());
                }
            });

            task.run()
                .then(() => {
                    off(CoreEvent.TaskExecutionTimedOut, listenerId);
                    resolve();
                })
                .catch((err) => {
                    off(CoreEvent.TaskExecutionTimedOut, listenerId);
                    reject(err);
                });
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
class ParameterizedTask {
    constructor(
        private task: Task,
        private taskParams: TaskParams,
        private platformEvent: PlatformEvent
    ) {}

    run(): Promise<void> {
        return this.task.run(this.taskParams, this.platformEvent);
    }

    cancel() {
        this.task.cancel();
    }
}
