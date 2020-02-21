import {
    PlannedTasksStore,
    plannedTasksDB
} from '../../../../../persistence/planned-tasks-store';
import { AlarmManager } from '../abstract-alarm-manager.android';
import { AndroidAlarmManager } from './manager.android';
import { WatchdogManager } from '../watchdog/manager.android';
import { PlannedTask, PlanningType } from '../../../../planner/planned-task';
import { RunnableTask } from '../../../../runnable-task';

const MIN_ALARM_INTERVAL = 60000;

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
        const plannedTasks = await this.plannedTaskStore.getAllSortedByNextRun(
            PlanningType.Alarm
        );
        if (plannedTasks.length > 0) {
            if (!this.alarmManager.alarmUp) {
                this.alarmManager.set(
                    this.calculateAlarmInterval(plannedTasks[0])
                );
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
        const allTasks = await this.plannedTaskStore.getAllSortedByNextRun(
            PlanningType.Alarm
        );
        const now = new Date().getTime();
        const plannedTask = new PlannedTask(PlanningType.Alarm, runnableTask);
        if (
            allTasks.length === 0 ||
            allTasks[0].nextRun(now) > plannedTask.nextRun(now)
        ) {
            this.alarmManager.set(this.calculateAlarmInterval(plannedTask));
            this.watchdogManager.set();
        }
        await this.plannedTaskStore.insert(plannedTask);

        return plannedTask;
    }

    async cancel(id: string) {
        const possibleExisting = await this.plannedTaskStore.get(id);
        if (!possibleExisting) {
            return;
        }
        const allTasks = await this.plannedTaskStore.getAllSortedByNextRun(
            PlanningType.Alarm
        );
        const now = new Date().getTime();
        if (allTasks.length === 1) {
            this.alarmManager.cancel();
            this.watchdogManager.cancel();
        } else if (
            allTasks[0].nextRun(now) === possibleExisting.nextRun(now) &&
            allTasks[1].nextRun(now) !== possibleExisting.nextRun(now)
        ) {
            this.alarmManager.set(this.calculateAlarmInterval(allTasks[1]));
        }
        await this.plannedTaskStore.delete(id);
    }

    private calculateAlarmInterval(plannedTask: PlannedTask): number {
        const nextRun = plannedTask.nextRun();

        return nextRun > MIN_ALARM_INTERVAL ? nextRun : MIN_ALARM_INTERVAL;
    }

    private log(message: string) {
        console.log(`AndroidAlarmScheduler: ${message}`);
    }
}
