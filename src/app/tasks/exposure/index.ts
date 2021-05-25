import { Task } from "@geotecinit/emai-framework/tasks";
import { StartExposureTask } from "~/app/tasks/exposure/start-task";

export { ExposureChange } from "./change-record";

export const exposureTasks: Array<Task> = [new StartExposureTask()];
