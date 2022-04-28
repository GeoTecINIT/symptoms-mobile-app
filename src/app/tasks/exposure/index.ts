import { Task } from "@awarns/core/tasks";
import { PreStartExposureTask } from "~/app/tasks/exposure/pre-start-exposure";
import { CancelPreExposureTask } from "~/app/tasks/exposure/cancel-pre-exposure";
import { StartExposureTask } from "./start-exposure";
import { ProcessExposureAnswers } from "./process-answers";
import { EvaluateExposureAnswers } from "~/app/tasks/exposure/evaluate-answers";
import { EvaluateExposureTask } from "./evaluate-exposure";
import { EvaluateExposureExtensionTask } from "./evaluate-exposure-ext";
import { FinishExposureTask } from "./finish-exposure";
import { ExposureFinalizationDropoutChecker } from "./finalization-dropout-checker";
import { PreExposureStatusChecker } from "~/app/tasks/exposure/escapes/pre-exposure-status-checker";
import { ExposureStatusChecker } from "./escapes/exposure-status-checker";
import { ExposureLeaveChecker } from "./escapes/exposure-leave-checker";
import { ExposureReturnChecker } from "./escapes/exposure-return-checker";
import { ExposureDropoutChecker } from "./escapes/exposure-dropout-checker";

export { ExposureChange } from "./change-record";

export const exposureTasks: Array<Task> = [
    // --> General tasks
    new PreStartExposureTask(),
    new CancelPreExposureTask(),
    new StartExposureTask(),
    new ProcessExposureAnswers(),
    new EvaluateExposureAnswers(),
    new EvaluateExposureTask(),
    new EvaluateExposureExtensionTask(),
    new FinishExposureTask(),
    new ExposureFinalizationDropoutChecker(),
    // --> Escapes
    new PreExposureStatusChecker(),
    new ExposureStatusChecker(),
    new ExposureLeaveChecker(),
    new ExposureReturnChecker(),
    new ExposureDropoutChecker(),
];
