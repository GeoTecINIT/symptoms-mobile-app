import { TaskTree, EventListenerCreator, DescribedTaskRunner } from '.';
import { Task } from '../task';
import { on } from '../../events';
import { run } from '..';
import { getTask, checkIfTaskExists } from '../provider';
import { RunnableTaskBuilder } from '../runnable-task';

type TaskVerifier = (taskName: string) => void;
type TaskProvider = (taskName: string) => Task;

export class TaskTreeLoader {
    private treeTasks: Set<Task>;
    private loadingTaskTree: Promise<void>;

    constructor(
        private eventListenerCreator: EventListenerCreator = on,
        private describedTaskRunner: DescribedTaskRunner = run,
        private taskVerifier: TaskVerifier = checkIfTaskExists,
        private taskProvider: TaskProvider = getTask
    ) {
        this.treeTasks = new Set();
    }

    async load(taskTree: TaskTree): Promise<void> {
        if (this.loadingTaskTree) {
            throw new Error('Loading more than one task tree is not permitted');
        }
        const createEventListener = (
            eventName: string,
            taskBuilder: RunnableTaskBuilder
        ) => this.eventListenerCreator(eventName, taskBuilder);
        const planTaskToBeRun = (taskName: string) =>
            this.trackTaskGoingToBeRun(taskName);

        this.log('Loading task tree');
        this.loadingTaskTree = taskTree.describe(
            createEventListener,
            planTaskToBeRun
        );
        await this.loadingTaskTree;
    }

    async isReady(): Promise<boolean> {
        const tasksToBePrepared = await this.tasksToBePrepared();

        return tasksToBePrepared.length === 0;
    }

    async prepare(): Promise<void> {
        const tasksToBePrepared = await this.tasksToBePrepared();
        this.log(`${tasksToBePrepared.length} are up to be prepared`);

        await Promise.all(tasksToBePrepared.map((task) => task.prepare()));
    }

    private trackTaskGoingToBeRun(taskName: string) {
        this.taskVerifier(taskName);
        this.treeTasks.add(this.taskProvider(taskName));

        return this.describedTaskRunner(taskName);
    }

    // TODO: Could be good to make this public, so developers using it
    // can check the names of the tasks to be prepared and show messages
    // to the users accordingly
    private async tasksToBePrepared(): Promise<Array<Task>> {
        if (!this.loadingTaskTree) {
            throw new Error('Load a task tree first!');
        }
        await this.loadingTaskTree;

        const tasksToBePrepared = [];
        for (const task of this.treeTasks) {
            const hasToBePrepared = await this.hasToBePrepared(task);
            if (hasToBePrepared) {
                tasksToBePrepared.push(task);
            }
        }

        return tasksToBePrepared;
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
        console.log(`TaskTreeLoader: ${message}`);
    }
}

export const taskTreeLoader = new TaskTreeLoader();
