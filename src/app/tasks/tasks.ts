import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { exposureTasks } from "./exposure";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...exposureTasks,
];
