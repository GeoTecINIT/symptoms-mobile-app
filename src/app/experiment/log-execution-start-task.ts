import { SimpleTask } from "nativescript-task-dispatcher/tasks";
import { ExperimentTask } from "./experiment-tasks";
import { taskExecutionRegistry } from "./task-execution-registry";

export class LogTaskExecutionStart extends SimpleTask {
    constructor(experimentTask: ExperimentTask) {
        super(
            `log${titlelize(experimentTask)}TaskExecutionStart`,
            async ({ evt }) => {
                taskExecutionRegistry.logStart(evt.id, experimentTask);
            },
            {
                foreground: true,
                outputEventNames: [
                    `${experimentTask.toLowerCase()}TaskExecutionStartLogged`,
                ],
            }
        );
    }
}

function titlelize(text: string) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}
