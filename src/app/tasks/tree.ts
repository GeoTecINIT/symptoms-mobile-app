import {
    TaskTree,
    EventListenerCreator,
    DescribedTaskRunner
} from '../core/tasks/tree';

class DemoTaskTree implements TaskTree {
    async describe(
        on: EventListenerCreator,
        run: DescribedTaskRunner
    ): Promise<void> {
        on('startEvent', run('fastTask').every(60));
        on('startEvent', run('acquireGeolocation').every(60));
        on('startEvent', run('mediumTask').every(120));
        on('startEvent', run('slowTask').every(240));

        on('slowTaskFinished', run('mediumTask').now());
        on('mediumTaskFinished', run('fastTask').now());
        on('geolocationAcquired', run('printGeolocation').now());
    }
}

export const taskTree = new DemoTaskTree();
