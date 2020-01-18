export const tasks: Tasks = {};

export interface Tasks {
    [key: string]: Task;
}

export abstract class Task {
    abstract run(): any;

    canRun() {
        return true;
    }
}
