import { Task } from "@awarns/core/tasks";
import { makeTraceable } from "@awarns/tracing";
import {
    startDetectingCoarseHumanActivityChangesTask,
    stopDetectingCoarseHumanActivityChangesTask,
} from "@awarns/human-activity";
import { acquirePhoneGeolocationTask } from "@awarns/geolocation";
import { checkAreaOfInterestProximityTask } from "@awarns/geofencing";
import { sendNotificationTask } from "@awarns/notifications";
import { writeRecordsTask } from "@awarns/persistence";

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
        ],
        { outputsSensitiveData: true }
    ),
    writeRecordsTask(),
];
