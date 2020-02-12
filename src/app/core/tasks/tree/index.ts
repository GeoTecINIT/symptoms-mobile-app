import { RunnableTaskBuilder } from '../runnable-task';
import { TaskParams } from '../task';

export type EventListenerCreator = (
    eventName: string,
    taskBuilder: RunnableTaskBuilder
) => void;
export type DescribedTaskRunner = (
    taskName: string,
    params?: TaskParams
) => RunnableTaskBuilder;

export interface TaskTree {
    describe(on: EventListenerCreator, run: DescribedTaskRunner): Promise<void>;
}
