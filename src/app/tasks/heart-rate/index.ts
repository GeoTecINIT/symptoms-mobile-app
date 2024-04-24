import { Task } from "@awarns/core/tasks";
import { makeTraceable } from "@awarns/tracing";

export const heartRateTasks: Array<Task> = [...makeTraceable([])];
