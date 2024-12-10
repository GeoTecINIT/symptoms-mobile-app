import { Task } from "@awarns/core/tasks";
import { makeTraceable } from "@awarns/tracing";
import { WriteHeartRateRecordsTask } from "./write-heart-rate-records";

export const heartRateTasks: Array<Task> = [
    ...makeTraceable([
        new WriteHeartRateRecordsTask(),
    ])
];
