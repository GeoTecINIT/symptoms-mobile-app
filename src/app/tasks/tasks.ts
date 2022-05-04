import { Task } from "@awarns/core/tasks";

import { awarnsTasks } from "~/app/tasks/framework";
import { utilityTasks } from "./utility";
import { exposureTasks } from "./exposure";
import { feedbackTasks } from "./feedback";
import { visualizationTasks } from "./visualizations";
import { notificationsTasks } from "./notifications";

export const appTasks: Array<Task> = [
    ...awarnsTasks,
    ...utilityTasks,
    ...feedbackTasks,
    ...exposureTasks,
    ...visualizationTasks,
    ...notificationsTasks,
];
