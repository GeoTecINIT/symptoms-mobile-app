import { Task } from "@awarns/core/tasks";
import { geofencingTask } from "@awarns/geofencing";

export const awarnsTasks: Array<Task> = [geofencingTask()];
