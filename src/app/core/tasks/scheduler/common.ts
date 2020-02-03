import { android as androidApp } from 'tns-core-modules/application/application';
import { TaskScheduler } from '.';
import { AndroidTaskScheduler } from './android';

let _taskScheduler: TaskScheduler = null;
export function taskScheduler() {
    if (!_taskScheduler) {
        if (androidApp) {
            _taskScheduler = new AndroidTaskScheduler();
        } else {
            throw new Error('Not implemented');
        }
    }

    return _taskScheduler;
}
