import { Task } from "@awarns/core/tasks";
import { geofencingTask } from "@awarns/geofencing";
import { singleGeolocationTask } from "@awarns/geolocation";

export const awarnsTasks: Array<Task> = [
    singleGeolocationTask({ bestOf: 3, timeout: 10000 }),
    geofencingTask(),
];
