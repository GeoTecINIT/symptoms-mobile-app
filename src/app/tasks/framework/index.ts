import { Task } from "@awarns/core/tasks";
import { checkAreaOfInterestProximityTask } from "@awarns/geofencing";
import { acquirePhoneGeolocationTask } from "@awarns/geolocation";
import {
    startDetectingCoarseHumanActivityChangesTask,
    stopDetectingCoarseHumanActivityChangesTask,
} from "@awarns/human-activity";
import { sendNotificationTask } from "@awarns/notifications";

export const awarnsTasks: Array<Task> = [
    startDetectingCoarseHumanActivityChangesTask(),
    stopDetectingCoarseHumanActivityChangesTask(),
    acquirePhoneGeolocationTask({ bestOf: 3, timeout: 10000 }),
    checkAreaOfInterestProximityTask(),
    sendNotificationTask(),
];
