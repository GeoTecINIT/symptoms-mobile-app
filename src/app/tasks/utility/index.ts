import { Task } from "@geotecinit/emai-framework/tasks";
import { EventConverterTask } from "~/app/tasks/utility/event-converter";

export const utilityTasks: Array<Task> = [
    new EventConverterTask("lowFrequencyGeolocationAcquisitionCanStart"),
    new EventConverterTask("lowFrequencyGeolocationAcquisitionCanStop"),
    new EventConverterTask("highFrequencyGeolocationAcquisitionCanStop"),
];
