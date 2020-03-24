import { SimpleTask } from '../core/tasks/base/simple-task';
import { BatteryLevel } from '../core/providers/battery/battery-level';

import { planningTimestamp } from '../core/tasks/scheduler/planning-timestamp';
import { taskExecutionRegistry } from './task-execution-registry';
import { ExecutionEntry } from './execution-entry';

import { CSVWriter } from '../core/persistence/csv-writer';
import { currentExperiment } from './current-experiment';

const LOG_FOLDER = 'SchedulerExperiment';

export const logExecutionEndTask = new SimpleTask(
    'logTaskExecutionEnd',
    async ({ evt, log }) => {
        const batteryLevel = evt.data.record as BatteryLevel;

        const planTimestamp = planningTimestamp.previous;
        const { startTime, task } = taskExecutionRegistry.getStartLog(evt.id);

        const executionEntry: ExecutionEntry = {
            planning_timestamp: planTimestamp,
            exec_timestamp: startTime,
            battery: batteryLevel.value,
            task
        };

        const csvWriter = new CSVWriter(
            LOG_FOLDER,
            currentExperiment.getLogFileName()
        );
        await csvWriter.write(executionEntry);
        log(`Logged: ${JSON.stringify(executionEntry)}`);
    }
);
