import { SimpleTask } from '../core/tasks/base/simple-task';
import { ExperimentTask } from './experiment-tasks';
import { TaskConfig } from '../core/tasks/task';
import { taskExecutionRegistry } from './task-execution-registry';

export class LogTaskExecutionStart extends SimpleTask {
    constructor(experimentTask: ExperimentTask, taskConfig?: TaskConfig) {
        super(
            `log${titlelize(experimentTask)}TaskExecutionStart`,
            async ({ evt }) => {
                taskExecutionRegistry.logStart(evt.id, experimentTask);
                this.done(
                    `${experimentTask.toLowerCase()}TaskExecutionStartLogged`
                );
            },
            taskConfig
        );
    }
}

function titlelize(text: string) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}
