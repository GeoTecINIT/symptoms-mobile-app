import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { exposureTasks } from "./exposure";
import { feedbackTasks } from "~/app/tasks/feedback";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...feedbackTasks,
    ...exposureTasks,
];
