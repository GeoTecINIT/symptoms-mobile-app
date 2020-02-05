import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { PlannedTask } from '../planner/planned-task';
import { getTask } from '../provider';
import { Task, TaskParams } from '../task';
import { PlatformEvent, on, CoreEvent, off } from '../../events';

export class SingleTaskRunner {
    constructor(private taskStore: PlannedTasksStore) {}

    async run(
        plannedTask: PlannedTask,
        startEvent: PlatformEvent
    ): Promise<void> {
        const { name, id, params } = plannedTask;
        const task = getTask(name);

        await this.taskStore.updateLastRun(id, new Date().getTime());

        try {
            const parameterizedTask = new ParameterizedTask(
                task,
                params,
                startEvent
            );
            await this.runWithTimeout(id, parameterizedTask, startEvent.id);
        } catch (error) {
            await this.taskStore.increaseErrorCount(id);
        }
    }

    private runWithTimeout(
        id: string,
        task: ParameterizedTask,
        startEventId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const listenerId = on(CoreEvent.TaskExecutionTimedOut, (evt) => {
                if (evt.id === startEventId) {
                    off(CoreEvent.TaskExecutionTimedOut, listenerId);
                    task.cancel();
                    this.taskStore
                        .increaseTimeoutCount(id)
                        .then(() => resolve());
                }
            });

            let taskAlreadyRun = false;
            let taskChainFinished = false;
            this.waitForTaskChainToFinish(startEventId).then(() => {
                taskChainFinished = true;
                if (taskAlreadyRun) {
                    resolve();
                }
            });

            task.run()
                .then(() => {
                    taskAlreadyRun = true;
                    off(CoreEvent.TaskExecutionTimedOut, listenerId);
                    if (taskChainFinished) {
                        resolve();
                    }
                })
                .catch((err) => {
                    off(CoreEvent.TaskExecutionTimedOut, listenerId);
                    reject(err);
                });
        });
    }

    private waitForTaskChainToFinish(startEventId: string): Promise<void> {
        return new Promise((resolve) => {
            const listenerId = on(
                CoreEvent.TaskChainFinished,
                (chainFinishedEvt) => {
                    if (chainFinishedEvt.id === startEventId) {
                        off(CoreEvent.TaskChainFinished, listenerId);
                        resolve();
                    }
                }
            );
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
class ParameterizedTask {
    constructor(
        private task: Task,
        private taskParams: TaskParams,
        private startEvent: PlatformEvent
    ) {}

    run(): Promise<void> {
        return this.task.run(this.taskParams, this.startEvent);
    }

    cancel() {
        this.task.cancel();
    }
}
