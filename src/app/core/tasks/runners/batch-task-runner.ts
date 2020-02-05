import { PlannedTasksStore } from '../../persistence/planned-tasks-store';
import { PlannedTask } from '../planner/planned-task';
import { PlatformEvent, on, CoreEvent, off } from '../../events';
import { SingleTaskRunner } from './single-task-runner';

export class BatchTaskRunner {
    private taskRunner: SingleTaskRunner;

    constructor(taskStore: PlannedTasksStore) {
        this.taskRunner = new SingleTaskRunner(taskStore);
    }

    async run(
        plannedTasks: Array<PlannedTask>,
        startEvent: PlatformEvent
    ): Promise<void> {
        await new Promise((resolve, reject) => {
            this.waitAllTaskChainsToFinish(
                startEvent.id,
                plannedTasks.length
            ).then(() => resolve());

            Promise.all(
                plannedTasks.map((plannedTask) =>
                    this.taskRunner.run(plannedTask, startEvent)
                )
            ).catch((err) => reject(err));
        });
    }

    private waitAllTaskChainsToFinish(
        startEventId: string,
        taskCount: number
    ): Promise<void> {
        return new Promise((resolve) => {
            let finishedTasks = 0;

            const listenerId = on(
                CoreEvent.TaskChainFinished,
                (chainFinishedEvt) => {
                    if (chainFinishedEvt.id !== startEventId) {
                        return;
                    }

                    finishedTasks++;

                    if (finishedTasks === taskCount) {
                        off(CoreEvent.TaskChainFinished, listenerId);
                        resolve();
                    }
                }
            );
        });
    }
}
