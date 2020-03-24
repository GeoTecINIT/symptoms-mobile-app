import { ExperimentTask } from './experiment-tasks';

class TaskExecutionRegistry {
    private taskExecutions: Map<string, TaskExecutionRegister>;

    constructor() {
        this.taskExecutions = new Map();
    }

    logStart(eventId: string, task: ExperimentTask) {
        const startTime = new Date().getTime();
        const execRegister: TaskExecutionRegister = {
            task,
            startTime
        };
        this.taskExecutions.set(eventId, execRegister);
    }

    getStartLog(eventId: string) {
        if (!this.taskExecutions.has(eventId)) {
            throw new Error(
                `No task has been found with invocationId: ${eventId}`
            );
        }

        return this.taskExecutions.get(eventId);
    }
}

export interface TaskExecutionRegister {
    task: ExperimentTask;
    startTime: number;
}

export const taskExecutionRegistry = new TaskExecutionRegistry();
