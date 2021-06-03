import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { exposureTasks } from "./exposure";
import { feedbackTasks } from "./feedback";
import { visualizationTasks } from "./visualizations";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...feedbackTasks,
    ...exposureTasks,
    ...visualizationTasks,
];
