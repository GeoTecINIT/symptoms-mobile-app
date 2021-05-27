import { Task } from "@geotecinit/emai-framework/tasks";
import { EventConverterTask } from "~/app/tasks/utility/event-converter";

export const utilityTasks: Array<Task> = [
    // Event converters
    // -> Low frequency geolocation acquisition
    new EventConverterTask("lowFrequencyGeolocationAcquisitionCanStart"),
    new EventConverterTask("lowFrequencyGeolocationAcquisitionCanStop"),
    // -> High frequency geolocation acquisition
    new EventConverterTask("highFrequencyGeolocationAcquisitionCanStop"),
    // -> High frequency multiple geolocation acquisition
    new EventConverterTask(
        "highFrequencyMultipleGeolocationAcquisitionCanStart"
    ),
    new EventConverterTask(
        "highFrequencyMultipleGeolocationAcquisitionCanStop"
    ),
    // -> Movement from AoI outer radius
    new EventConverterTask("movedOutsideAreaOfInterestOuterRadius"),
    // -> Questionnaire delivery canceled
    new EventConverterTask("questionnaireDeliveryCancelled"),
];
