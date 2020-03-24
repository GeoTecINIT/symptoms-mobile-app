import { ExperimentTask } from './experiment-tasks';

export interface ExecutionEntry {
    planning_timestamp: number;
    exec_timestamp: number;
    battery: number;
    task: ExperimentTask;
}
