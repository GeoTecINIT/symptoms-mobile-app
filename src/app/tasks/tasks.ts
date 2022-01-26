import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { exposureTasks } from "./exposure";
import { feedbackTasks } from "./feedback";
import { visualizationTasks } from "./visualizations";
import { notificationsTasks } from "./notifications";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...feedbackTasks,
    ...exposureTasks,
    ...visualizationTasks,
    ...notificationsTasks,
];
