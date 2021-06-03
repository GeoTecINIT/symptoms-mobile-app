import { Task } from "@geotecinit/emai-framework/tasks";
import { CalculateExposureAggregate } from "./calc-exposure-aggregate";
import { CalculateExposurePlaceAggregate } from "./calc-exposure-place-aggregate";

export { ExposureAggregate } from "./exposure-aggregate";
export { ExposurePlaceAggregate } from "./exposure-place-aggregate";

export const visualizationTasks: Array<Task> = [
    new CalculateExposureAggregate(),
    new CalculateExposurePlaceAggregate(),
];
