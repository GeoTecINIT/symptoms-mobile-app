import {
    PlannedTasksStore,
    plannedTasksDB
} from '../../../../../persistence/planned-tasks-store';
import { AlarmManager } from '../abstract-alarm-manager.android';
import { AndroidAlarmManager } from './manager.android';
import { WatchdogManager } from '../watchdog/manager.android';
import { PlannedTask, PlanningType } from '../../../../planner/planned-task';
import { RunnableTask } from '../../../../runnable-task';

export class AndroidAlarmScheduler {
    constructor(
        private alarmManager: AlarmManager = new AndroidAlarmManager(),
        private watchdogManager: AlarmManager = new WatchdogManager(),
        private plannedTaskStore: PlannedTasksStore = plannedTasksDB
    ) {}

    async setup(): Promise<void> {
        if (this.alarmManager.alarmUp && this.watchdogManager.alarmUp) {
            return;
        }
        this.log('Alarm was not up! Scheduling...');
        const plannedTasks = await this.plannedTaskStore.getAllSortedByInterval(
            PlanningType.Alarm
        );
        if (plannedTasks.length > 0) {
            if (!this.alarmManager.alarmUp) {
                this.alarmManager.set(plannedTasks[0].interval);
            }
            if (!this.watchdogManager.alarmUp) {
                this.watchdogManager.set();
            }
        }
    }

    async schedule(runnableTask: RunnableTask): Promise<PlannedTask> {
        // TODO: move to index
        const possibleExisting = await this.plannedTaskStore.get(runnableTask);
        if (possibleExisting) {
            return possibleExisting;
        }
        const allTasks = await this.plannedTaskStore.getAllSortedByInterval(
            PlanningType.Alarm
        );
        if (
            allTasks.length === 0 ||
            allTasks[0].interval > runnableTask.interval
        ) {
            this.alarmManager.set(runnableTask.interval);
            this.watchdogManager.set();
        }
        const plannedTask = new PlannedTask(PlanningType.Alarm, runnableTask);
        await this.plannedTaskStore.insert(plannedTask);

        return plannedTask;
    }

    async cancel(id: string) {
        const possibleExisting = await this.plannedTaskStore.get(id);
        if (!possibleExisting) {
            return;
        }
        const allTasks = await this.plannedTaskStore.getAllSortedByInterval(
            PlanningType.Alarm
        );
        if (allTasks.length === 1) {
            this.alarmManager.cancel();
            this.watchdogManager.cancel();
        } else if (
            allTasks[0].interval === possibleExisting.interval &&
            allTasks[1].interval !== possibleExisting.interval
        ) {
            this.alarmManager.set(allTasks[1].interval);
        }
        await this.plannedTaskStore.delete(id);
    }

    private log(message: string) {
        console.log(`AndroidAlarmScheduler: ${message}`);
    }
}
