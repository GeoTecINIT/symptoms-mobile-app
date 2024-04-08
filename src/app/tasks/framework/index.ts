import { Task } from "@awarns/core/tasks";
import { makeTraceable, trackEventTask } from "@awarns/tracing";
import {
    startDetectingCoarseHumanActivityChangesTask,
    stopDetectingCoarseHumanActivityChangesTask,
} from "@awarns/human-activity";
import { acquirePhoneGeolocationTask } from "@awarns/geolocation";
import { checkAreaOfInterestProximityTask } from "@awarns/geofencing";
import {
    sendNotificationTask,
    sendRandomNotificationTask,
} from "@awarns/notifications";
import { writeRecordsTask } from "@awarns/persistence";
import {
    WatchSensor,
    WatchSensorDelay,
    sendPlainMessageToWatchAndAwaitResponseTask,
    sendPlainMessageToWatchTask,
    startDetectingWatchSensorChangesTask,
    stopDetectingWatchSensorChangesTask,
} from "@awarns/wear-os";

export const awarnsTasks: Array<Task> = [
    ...makeTraceable([
        startDetectingCoarseHumanActivityChangesTask(),
        stopDetectingCoarseHumanActivityChangesTask(),
    ]),
    ...makeTraceable(
        [
            acquirePhoneGeolocationTask({ bestOf: 3, timeout: 10000 }),
            checkAreaOfInterestProximityTask(),
            sendNotificationTask(),
            sendRandomNotificationTask(),
        ],
        { outputsSensitiveData: true }
    ),
    ...makeTraceable([
        startDetectingWatchSensorChangesTask(WatchSensor.HEART_RATE, {
            sensorDelay: WatchSensorDelay.NORMAL,
            batchSize: 10,
        }),
        stopDetectingWatchSensorChangesTask(WatchSensor.HEART_RATE),
        sendPlainMessageToWatchTask(),
        sendPlainMessageToWatchAndAwaitResponseTask(),
    ]),
    writeRecordsTask(),
    // trackEventTask(),
];
