import { ScheduledTaskPlanner } from '../scheduled-task-planner';
import { AlarmManager, AndroidAlarmManager } from './alarm-manager.android';
import { scheduledTasksDB } from '../scheduled-tasks-store';
import { createAlarmRunnerServiceIntent } from '../../utils/android-intents.android';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    private taskPlanner: ScheduledTaskPlanner;
    private alarmManager: AlarmManager;
    private timeOffset: number;
    private currentTime: number;

    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        this.log('Alarm triggered');

        this.timeOffset = 30000;
        this.currentTime = new Date().getTime();
        this.taskPlanner = new ScheduledTaskPlanner(
            'alarm',
            scheduledTasksDB,
            this.timeOffset,
            this.currentTime
        );
        this.alarmManager = new AndroidAlarmManager();

        this.handleAlarmTrigger(context)
            .then(() => {
                this.log('Alarm handled');
            })
            .catch((err) => {
                this.log(`${err}`);
            });
    }

    private async handleAlarmTrigger(context: android.content.Context) {
        await this.rescheduleIfNeeded();
        await this.startTaskRunnerService(context);
    }

    private async rescheduleIfNeeded() {
        const willContinue = await this.taskPlanner.willContinue();
        if (willContinue) {
            const nextInterval = await this.taskPlanner.nextInterval();
            this.alarmManager.set(nextInterval);
            this.log(`Next alarm will be run in: ${nextInterval}`);
        } else {
            this.log('AlarmReceiver: Won\'t reschedule');
        }
    }

    private async startTaskRunnerService(context: android.content.Context) {
        const tasksToRun = await this.taskPlanner.tasksToRun();
        if (tasksToRun.length > 0) {
            const requiresForeground = await this.taskPlanner.requiresForeground();
            this.startAlarmRunnerService(context, requiresForeground);
        } else {
            this.log('WARNING - triggered without tasks to run');
        }
    }

    private startAlarmRunnerService(
        context: android.content.Context,
        inForeground: boolean
    ) {
        const startRunnerService = createAlarmRunnerServiceIntent(context, {
            runInForeground: inForeground,
            timeOffset: this.timeOffset,
            invocationTime: this.currentTime
        });
        if (inForeground) {
            androidx.core.content.ContextCompat.startForegroundService(
                context,
                startRunnerService
            );
        } else {
            context.startService(startRunnerService);
        }
    }

    private log(message: string) {
        console.log(`AlarmReceiver: ${message}`);
    }
}
