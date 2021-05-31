import { Task } from "@geotecinit/emai-framework/tasks";
import { StartExposureTask } from "./start-exposure";
import { ProcessExposureAnswers } from "./process-answers";
import { EvaluateExposureTask } from "./evaluate-exposure";
import { EvaluateExposureExtensionTask } from "./evaluate-exposure-ext";
import { FinishExposureTask } from "./finish-exposure";
import { ExposureFinalizationDropoutChecker } from "./finalization-dropout-checker";
import { ExposureStatusChecker } from "./escapes/exposure-status-checker";
import { ExposureLeaveChecker } from "./escapes/exposure-leave-checker";
import { ExposureReturnChecker } from "./escapes/exposure-return-checker";
import { ExposureDropoutChecker } from "./escapes/exposure-dropout-checker";

export { ExposureChange } from "./change-record";

export const exposureTasks: Array<Task> = [
    // --> General tasks
    new StartExposureTask(),
    new ProcessExposureAnswers(),
    new EvaluateExposureTask(),
    new EvaluateExposureExtensionTask(),
    new FinishExposureTask(),
    new ExposureFinalizationDropoutChecker(),
    // --> Escapes
    new ExposureStatusChecker(),
    new ExposureLeaveChecker(),
    new ExposureReturnChecker(),
    new ExposureDropoutChecker(),
];
