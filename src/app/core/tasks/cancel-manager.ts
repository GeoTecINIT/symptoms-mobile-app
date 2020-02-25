import {
    PlannedTasksStore,
    plannedTasksDB
} from '../persistence/planned-tasks-store';
import { TaskScheduler, taskScheduler as getTaskScheduler } from './scheduler';
import { on, off } from '../events';
import { PlannedTask, PlanningType } from './planner/planned-task';

export class TaskCancelManager {
    constructor(
        private taskStore: PlannedTasksStore = plannedTasksDB,
        private taskScheduler?: TaskScheduler
    ) {}

    async init(): Promise<void> {
        const cancelEvents = await this.taskStore.getAllCancelEvents();
        cancelEvents.forEach((eventName) => {
            const listenerId = on(eventName, (evt) => {
                const evtName = evt.name;
                off(evtName, listenerId);
                this.cancelByEventName(evtName);
            });
        });
    }

    private async cancelByEventName(eventName: string): Promise<void> {
        const tasks = await this.taskStore.getAllFilteredByCancelEvent(
            eventName
        );
        await Promise.all(tasks.map((task) => this.cancelTask(task)));
    }

    private async cancelTask(task: PlannedTask): Promise<void> {
        try {
            if (task.planningType === PlanningType.Alarm) {
                console.log(this.taskScheduler);
                await this.getTaskScheduler().cancel(task.id);
            } else {
                await this.taskStore.delete(task.id);
            }
        } catch (err) {
            const { id, name, startAt, interval, recurrent } = task;
            console.log(
                `TaskCancelManager: Error canceling task: ${JSON.stringify({
                    id,
                    name,
                    startAt,
                    interval,
                    recurrent
                })} -> ${err}`
            );
        }
    }

    private getTaskScheduler(): TaskScheduler {
        if (!this.taskScheduler) {
            this.taskScheduler = getTaskScheduler();
        }

        return this.taskScheduler;
    }
}
