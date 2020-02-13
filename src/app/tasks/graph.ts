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
        on('startEvent', run('fastTask').every(1, 'minutes'));
        on('startEvent', run('acquireGeolocation').every(1, 'minutes'));
        on('startEvent', run('mediumTask').every(2, 'minutes'));
        on('startEvent', run('slowTask').every(4, 'minutes'));
        on('startEvent', run('incrementalTask').in(1, 'minutes'));

        on('slowTaskFinished', run('mediumTask'));
        on('mediumTaskFinished', run('fastTask'));
        on('geolocationAcquired', run('printGeolocation'));
    }
}

export const demoTaskGraph = new DemoTaskGraph();
