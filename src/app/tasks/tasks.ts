import { Task } from "@geotecinit/emai-framework/tasks";

import { utilityTasks } from "./utility";
import { notificationTasks } from "./notifications";
import { exposureTasks } from "./exposure";
import { feedbackTasks } from "~/app/tasks/feedback";

export const appTasks: Array<Task> = [
    ...utilityTasks,
    ...notificationTasks,
    ...feedbackTasks,
    ...exposureTasks,
];
