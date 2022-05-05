import { Task } from "@awarns/core/tasks";
import { CalculateExposureAggregate } from "./calc-exposure-aggregate";
import { CalculateExposurePlaceAggregate } from "./calc-exposure-place-aggregate";
import { makeTraceable } from "@awarns/tracing";

export { ExposureAggregate } from "./exposure-aggregate";
export { ExposurePlaceAggregate } from "./exposure-place-aggregate";

export const visualizationTasks: Array<Task> = [
    ...makeTraceable([
        new CalculateExposureAggregate(),
        new CalculateExposurePlaceAggregate(),
    ]),
];
