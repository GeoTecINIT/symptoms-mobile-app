import { TaskPlanner } from './task-planner';
import { TaskParams } from '../tasks/task';
import { RunnableTaskBuilder } from './runnable-task';

const taskPlanner = new TaskPlanner(null, null);

export function run(taskName: string, params: TaskParams = {}) {
    return new RunnableTaskBuilder(taskName, params, taskPlanner);
}
