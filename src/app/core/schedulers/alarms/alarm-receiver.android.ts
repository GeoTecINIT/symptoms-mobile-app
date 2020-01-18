import { TaskPlanner } from '../task-planner';
import { AlarmManager, AndroidAlarmManager } from './alarm-manager.android';
import { scheduledTasksDB } from '../scheduled-tasks-store';

const RUN_IN_FOREGROUND = 'foreground';
const ALARM_RUNNER_SERVICE =
    'es.uji.geotec.symptomsapp.alarms.AlarmRunnerService';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    private taskPlanner: TaskPlanner;
    private alarmManager: AlarmManager;

    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        console.log('AlarmReceiver: Alarm trigger');

        const offset = 30000; // TODO: Discuss about the most suitable value
        this.taskPlanner = new TaskPlanner('alarm', scheduledTasksDB, offset);
        this.alarmManager = new AndroidAlarmManager();

        this.handleAlarmTrigger(context)
            .then(() => {
                console.log('AlarmReceiver: Alarm handled');
            })
            .catch((err) => {
                console.log(`AlarmReceiver: ${err}`);
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
            console.log(
                `AlarmReceiver: Next alarm will be run in: ${nextInterval}`
            );
        } else {
            console.log('AlarmReceiver: Won\'t reschedule');
        }
    }

    private async startTaskRunnerService(context: android.content.Context) {
        const tasksToRun = await this.taskPlanner.tasksToRun();
        if (tasksToRun.length > 0) {
            const requiresForeground = await this.taskPlanner.requiresForeground();
            this.startAlarmRunnerService(context, requiresForeground);
        } else {
            console.log(
                'AlarmReceiver: WARNING, triggered without tasks to run'
            );
        }
    }

    private startAlarmRunnerService(
        context: android.content.Context,
        inForeground: boolean
    ) {
        const appContext: android.content.Context = context;
        const startRunnerService = new android.content.Intent();
        const alarmRunnerService = new android.content.ComponentName(
            context,
            ALARM_RUNNER_SERVICE
        );
        startRunnerService.setComponent(alarmRunnerService);
        startRunnerService.putExtra(RUN_IN_FOREGROUND, inForeground);
        if (inForeground) {
            androidx.core.content.ContextCompat.startForegroundService(
                appContext,
                startRunnerService
            );
        } else {
            appContext.startService(startRunnerService);
        }
    }
}
