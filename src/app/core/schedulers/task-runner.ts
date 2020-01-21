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

    private async runTask(id: string, task: Task): Promise<void> {
        await this.taskStore.updateLastRun(id, new Date().getTime());

        try {
            await this.runWithTimeout(id, task);
        } catch (error) {
            await this.taskStore.increaseErrorCount(id);
        }
    }

    private runWithTimeout(id: string, task: Task): Promise<void> {
        return new Promise((resolve, reject) => {
            this.timeouts[id] = setTimeout(() => {
                task.cancel();
                this.taskStore.increaseTimeoutCount(id).then(() => resolve());
            }, task.timeout);

            task.run()
                .then(() => {
                    clearTimeout(this.timeouts[id]);
                    resolve();
                })
                .catch((err) => {
                    clearTimeout(this.timeouts[id]);
                    reject(err);
                });
        });
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
