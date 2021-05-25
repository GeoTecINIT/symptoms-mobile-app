import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { notificationTasks } from "./notifications";
import { exposureTasks } from "./exposure";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...notificationTasks,
    ...exposureTasks,
];
