import { unpackAlarmRunnerServiceIntent } from '~/app/core/utils/android-intents.android';
import {
    AndroidNotification,
    createNotification
} from '~/app/core/notification-manager.android';
import {
    plannedTasksDB,
    PlannedTasksStore
} from '~/app/core/persistence/planned-tasks-store';
import { ScheduledTaskPlanner } from '~/app/core/schedulers/scheduled-task-planner';
import { BatchTaskRunner } from '../../../runners/batch-task-runner';
import { PlatformEvent, CoreEvent, emit, createEvent } from '~/app/core/events';
import { uuid } from '~/app/core/utils/uuid';

const DEFAULT_TIMEOUT = 60000;
const TIMEOUT_EVENT_OFFSET = 5000;

// WARNING: Update the other occurrences of this line each time it gets modified
@JavaProxy('es.uji.geotec.symptomsapp.alarms.AlarmRunnerService')
export class AlarmRunnerService extends android.app.Service {
    private runsInForeground: boolean;
    private timeOffset: number;
    private currentTime: number;

    private started: boolean;
    private inForeground: boolean;

    private wakeLock: android.os.PowerManager.WakeLock;
    private taskStore: PlannedTasksStore;

    onCreate() {
        super.onCreate();
        this.runsInForeground = false;
        this.timeOffset = 0;
        this.currentTime = new Date().getTime();

        this.started = false;
        this.inForeground = false;

        this.wakeLock = alarmRunnerWakeLock(this);
        this.taskStore = plannedTasksDB;

        this.log('onCreate called');
    }

    onStartCommand(
        intent: android.content.Intent,
        flags: number,
        startId: number
    ): number {
        super.onStartCommand(intent, flags, startId);
        this.log('Service called');
        const startFlag = android.app.Service.START_STICKY;

        if (this.alreadyRunning(startId)) {
            return startFlag;
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

        return startFlag;
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
            this.started = true;
            this.log('Service started');

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

    private runInForeground() {
        if (this.inForeground) {
            return;
        }
        this.startForeground(
            AndroidNotification.BehaviorTracking,
            createNotification(this, AndroidNotification.BehaviorTracking)
        );
        this.inForeground = true;
        this.log('Running in foreground');
    }

    private moveToBackground() {
        if (!this.inForeground) {
            return;
        }
        const andRemoveNotification = true;
        this.stopForeground(andRemoveNotification);
        this.inForeground = false;
        this.log('Running in background');
    }

    private async runTasks() {
        const taskPlanner = this.createTaskPlanner();

        const tasksToRun = await taskPlanner.tasksToRun();
        const taskCount = tasksToRun.length;
        if (taskCount > 0) {
            const taskRunner = new BatchTaskRunner(this.taskStore);
            const timeout = await this.calculateTimeout(taskPlanner);
            const timeoutEventId = this.setExecutionTimeout(timeout);

            console.log(`Running ${taskCount} tasks`);
            await taskRunner.run(tasksToRun, timeoutEventId);
        } else {
            this.log('WARNING - Service was called but no tasks were run!');
        }
    }

    private createTaskPlanner() {
        return new ScheduledTaskPlanner(
            'alarm',
            this.taskStore,
            this.timeOffset,
            this.currentTime
        );
    }

    private setExecutionTimeout(timeout: number): string {
        this.wakeLock.acquire(timeout);
        const timeoutEvent = createEvent(CoreEvent.TaskExecutionTimedOut);
        setTimeout(() => emit(timeoutEvent), timeout - TIMEOUT_EVENT_OFFSET);

        return timeoutEvent.id;
    }

    private async calculateTimeout(taskPlanner: ScheduledTaskPlanner) {
        const time = await taskPlanner.nextInterval();

        return Math.max(time, DEFAULT_TIMEOUT);
    }

    private gracefullyStop() {
        this.moveToBackground();
        if (this.started) {
            this.log('Stopping service');
            this.stopSelf(1);
            this.started = false;
        }
        if (this.wakeLock.isHeld()) {
            this.log('Lock released');
            this.wakeLock.release();
        }
    }

    private log(message: string) {
        console.log(`AlarmRunnerService: ${message}`);
    }
}

function alarmRunnerWakeLock(
    context: android.content.Context
): android.os.PowerManager.WakeLock {
    const wakeLockName = 'Symptoms::AlarmRunnerWakeLock';
    const powerManager = context.getSystemService(
        android.content.Context.POWER_SERVICE
    ) as android.os.PowerManager;

    return powerManager.newWakeLock(
        android.os.PowerManager.PARTIAL_WAKE_LOCK,
        wakeLockName
    );
}
