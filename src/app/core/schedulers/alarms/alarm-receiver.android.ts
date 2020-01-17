import { TaskPlanner } from '../task-planner';
import { scheduledTasksDB } from '../scheduled-tasks-store';
import { AndroidAlarmManager, AlarmManager } from './alarm-manager.android';

@JavaProxy('es.uji.geotec.symptomsapp.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    private taskPlanner: TaskPlanner;
    private alarmManager: AlarmManager;

    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        console.log('AlarmReceiver: Alarm triggered');

        const offset = 30000; // TODO: Discuss about the most suitable value
        this.taskPlanner = new TaskPlanner('alarm', scheduledTasksDB, offset);
        this.alarmManager = new AndroidAlarmManager();

        this.handleAlarmTrigger()
            .then(() => {
                console.log('AlarmReceiver: Alarm handled');
            })
            .catch((err) => {
                console.log(`AlarmReceiver: ${err}`);
            });
    }

    private async handleAlarmTrigger() {
        await this.rescheduleIfNeeded();
        await this.startTaskRunnerService();
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

    private async startTaskRunnerService() {
        const tasksToRun = await this.taskPlanner.tasksToRun();
        if (tasksToRun.length > 0) {
            const requiresForeground = await this.taskPlanner.requiresForeground();
            console.log(
                `Task execution requires foreground runner: ${requiresForeground}`
            );
        } else {
            console.log(
                'AlarmReceiver: WARNING, triggered without tasks to run'
            );
        }
    }
}
