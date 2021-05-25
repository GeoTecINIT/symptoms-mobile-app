import { Task } from "@geotecinit/emai-framework/tasks";
import { StartExposureTask } from "./start-task";
import { ExposureLeaveChecker } from "./escapes/exposure-leave-checker";
import { ExposureReturnChecker } from "./escapes/exposure-return-checker";

export { ExposureChange } from "./change-record";

export const exposureTasks: Array<Task> = [
    // --> General tasks
    new StartExposureTask(),
    // --> Escapes
    new ExposureLeaveChecker(),
    new ExposureReturnChecker(),
];
