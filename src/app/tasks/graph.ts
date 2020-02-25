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
            run('fastTask')
                .every(1, 'minutes')
                .cancelOn('stopEvent')
        );
        on(
            'startEvent',
            run('acquireGeolocation')
                .every(1, 'minutes')
                .cancelOn('stopEvent')
        );
        on(
            'startEvent',
            run('mediumTask')
                .every(2, 'minutes')
                .cancelOn('stopEvent')
        );
        on(
            'startEvent',
            run('slowTask')
                .every(4, 'minutes')
                .cancelOn('stopEvent')
        );

        on('slowTaskFinished', run('mediumTask'));
        on('mediumTaskFinished', run('fastTask'));
        on('geolocationAcquired', run('printGeolocation'));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
