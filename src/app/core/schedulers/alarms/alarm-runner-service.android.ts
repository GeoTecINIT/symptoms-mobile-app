import { unpackAlarmRunnerServiceIntent } from '../../utils/android-intents.android';
import { TaskRunner } from '../task-runner';
import { TaskPlanner } from '../task-planner';
import { scheduledTasksDB } from '../scheduled-tasks-store';

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.AlarmRunnerService')
export class AlarmRunnerService extends android.app.Service {
    private runsInForeground: boolean;
    private timeOffset: number;
    private currentTime: number;

    private started: boolean;
    private inForeground: boolean;

    private wakeLock: android.os.PowerManager.WakeLock;

    onCreate() {
        super.onCreate();
        this.runsInForeground = false;
        this.timeOffset = 0;
        this.currentTime = new Date().getTime();

        this.started = false;
        this.inForeground = false;

        this.log('onCreate called');
    }

    onStartCommand(
        intent: android.content.Intent,
        flags: number,
        startId: number
    ): number {
        super.onStartCommand(intent, flags, startId);
        this.log('Service called');

        if (this.alreadyRunning(startId)) {
            return;
        }

        this.extractInvocationArguments(intent);
        if (this.runsInForeground) {
            this.runInForeground();
        }

        this.runTasks()
            .then(() => {
                this.log('Tasks finished running');
                this.gracefullyStop();
            })
            .catch((err) => {
                this.log(`ERROR - While running tasks ${err}`);
                this.gracefullyStop();
            });

        return android.app.Service.START_STICKY;
    }

    onBind(intent: android.content.Intent): android.os.IBinder {
        return null; // Service cannot be bound
    }

    onDestroy() {
        this.log('onDestroy called');
        this.gracefullyStop();
        super.onDestroy();
    }

    private alreadyRunning(startId: number) {
        if (startId === 1) {
            this.log('Service started');
            this.started = true;

            return false;
        }
        this.log(
            `WARNING - Service already running! Dismissing call -> startId: ${startId}!`
        );
        this.stopSelf(startId);

        return true;
    }

    private extractInvocationArguments(intent: android.content.Intent) {
        const args = unpackAlarmRunnerServiceIntent(intent);
        this.log(
            `InvocationParams {runsInForeground=${args.runInForeground}, offset=${args.timeOffset}, invocationTime=${args.invocationTime}}`
        );
        this.runsInForeground = args.runInForeground;
        this.timeOffset = args.timeOffset;
        this.currentTime = args.invocationTime;
    }

    // TODO: Make it truly run in foreground
    private runInForeground() {
        if (this.inForeground) {
            return;
        }
        this.log('Running in foreground');
    }

    // TODO: Make it truly stop running in foreground
    private moveToBackground() {
        if (!this.inForeground) {
            return;
        }
        this.log('Running in background');
    }

    private async runTasks() {
        const taskStore = scheduledTasksDB;
        const taskPlanner = new TaskPlanner(
            'alarm',
            taskStore,
            this.timeOffset,
            this.currentTime
        );

        const tasksToRun = await taskPlanner.tasksToRun();
        const taskCount = tasksToRun.length;
        if (taskCount > 0) {
            // TODO: Adquire wakelock

            const taskRunner = new TaskRunner(tasksToRun, taskStore);
            console.log(`Running ${taskCount} tasks`);
            await taskRunner.run();
        } else {
            this.log('WARNING - Service was called but no tasks were run!');
        }
    }

    // TODO: Stop service cleanly
    private gracefullyStop() {
        this.moveToBackground();
        if (this.started) {
            this.log('Stopping service');
            this.stopSelf(1);
            this.started = false;
        }
        if (this.wakeLock) {
            this.wakeLock.release();
        }
    }

    private log(message: string) {
        console.log(`AlarmRunnerService: ${message}`);
    }
}
