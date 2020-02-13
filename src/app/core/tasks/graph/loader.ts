import { TaskGraph, TaskEventBinder, RunnableTaskDescriptor } from '.';
import { Task } from '../task';
import { on } from '../../events';
import { run } from '..';
import { getTask, checkIfTaskExists } from '../provider';
import { RunnableTaskBuilder } from '../runnable-task';

type TaskVerifier = (taskName: string) => void;
type TaskProvider = (taskName: string) => Task;

export class TaskGraphLoader {
    private graphTasks: Set<Task>;
    private loadingTaskGraph: Promise<void>;

    constructor(
        private taskEventBinder: TaskEventBinder = on,
        private runnableTaskDescriptor: RunnableTaskDescriptor = run,
        private taskVerifier: TaskVerifier = checkIfTaskExists,
        private taskProvider: TaskProvider = getTask
    ) {
        this.graphTasks = new Set();
    }

    async load(graph: TaskGraph): Promise<void> {
        if (this.loadingTaskGraph) {
            throw new Error(
                'Loading more than one task graph is not permitted'
            );
        }
        const createEventListener = (
            eventName: string,
            taskBuilder: RunnableTaskBuilder
        ) => this.taskEventBinder(eventName, taskBuilder);
        const planTaskToBeRun = (taskName: string) =>
            this.trackTaskGoingToBeRun(taskName);

        this.log('Loading task graph');
        this.loadingTaskGraph = graph.describe(
            createEventListener,
            planTaskToBeRun
        );
        await this.loadingTaskGraph;
    }

    async isReady(): Promise<boolean> {
        const tasksToBePrepared = await this.tasksNotReady();

        return tasksToBePrepared.length === 0;
    }

    async prepare(): Promise<void> {
        const tasksToBePrepared = await this.tasksNotReady();
        this.log(`${tasksToBePrepared.length} are up to be prepared`);

        await Promise.all(tasksToBePrepared.map((task) => task.prepare()));
    }

    async tasksNotReady(): Promise<Array<Task>> {
        if (!this.loadingTaskGraph) {
            throw new Error('Load a task graph first!');
        }
        await this.loadingTaskGraph;

        const tasksToBePrepared = [];
        for (const task of this.graphTasks) {
            const hasToBePrepared = await this.hasToBePrepared(task);
            if (hasToBePrepared) {
                tasksToBePrepared.push(task);
            }
        }

        return tasksToBePrepared;
    }

    private trackTaskGoingToBeRun(taskName: string) {
        this.taskVerifier(taskName);
        this.graphTasks.add(this.taskProvider(taskName));

        return this.runnableTaskDescriptor(taskName);
    }

    private async hasToBePrepared(task: Task): Promise<boolean> {
        try {
            await task.checkIfCanRun();

            return false;
        } catch (err) {
            return true;
        }
    }

    private log(message: string) {
        console.log(`TaskGraphLoader: ${message}`);
    }
}

export const taskGraph = new TaskGraphLoader();
