import { ScheduledTask } from './scheduled-task';
import { ScheduledTasksStore } from './scheduled-tasks-store';
import { getTask } from '../tasks/task-provider';
import { Task } from '../tasks/task';

export class TaskRunner {
    private timeouts: { [key: string]: number } = {};
    constructor(
        private scheduledTasks: Array<ScheduledTask>,
        private taskStore: ScheduledTasksStore
    ) {}

    getTimeout(): number {
        const allTasks = this.getTasks();

        const maxTimeout = allTasks.reduce(
            (previous, current) =>
                current.task.timeout > previous
                    ? current.task.timeout
                    : previous,
            0
        );

        return maxTimeout;
    }

    async run(): Promise<void> {
        const allTasks = this.getTasks();

        await Promise.all(
            allTasks.map((task) => this.runTask(task.id, task.task))
        );
    }

    private async runTask(id: string, task: Task) {
        await this.taskStore.updateLastRun(id, new Date().getTime());
        this.timeouts[id] = setTimeout(async () => {
            task.cancel();
            await this.taskStore.increaseTimeoutCount(id);
        }, task.timeout);

        try {
            await task.run();
        } catch (error) {
            await this.taskStore.increaseErrorCount(id);
        }
    }

    private getTasks() {
        return this.scheduledTasks.map((scheduledTask) => ({
            id: scheduledTask.id,
            task: getTask(scheduledTask.task)
        }));
    }
}

interface IdTask {
    id: string;
    task: Task;
}
