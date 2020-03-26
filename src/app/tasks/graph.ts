import {
    TaskGraph,
    TaskEventBinder,
    RunnableTaskDescriptor
} from '../core/tasks/graph';

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: TaskEventBinder,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on(
            'startEvent',
            run('logDummyTaskExecutionStart')
                .every(1, 'minutes')
                .cancelOn('stopEvent')
        );
        /* on(
            'startEvent',
            run('logGPSTaskExecutionStart')
                .every(1, 'minutes')
                .cancelOn('stopEvent')
        ); */

        on('dummyTaskExecutionStartLogged', run('acquireBatteryLevel'));

        // on('gpsTaskExecutionStartLogged', run('acquireGeolocation'));
        // on('geolocationAcquired', run('acquireBatteryLevel'));

        on('batteryLevelAcquired', run('logTaskExecutionEnd'));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
