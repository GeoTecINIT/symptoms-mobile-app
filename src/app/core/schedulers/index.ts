export let schedule;
import { android as androidApp } from 'tns-core-modules/application/application';
import { AlarmScheduler } from './alarm-scheduler.android';

export function initializeScheduler(production: boolean) {
    schedule = (time: number, task): ScheduledTask => {
        if (time >= 5 && time < 60) {
            throw new Error('Not implemented yet');
        } else if (time < 900) {
            if (androidApp) {
                const alarmScheduler = new AlarmScheduler(
                    time * 1000,
                    task,
                    production
                );
                // TODO: alarmScheduler.schedule devuelve algo que pasar a ScheduledTask...
                alarmScheduler.schedule();

                return new ScheduledTask();
            } else {
                throw new Error('Not implemented yet');
            }
        } else {
            throw new Error('Not implemented yet');
        }
    };
}

export class ScheduledTask {
    get scheduled(): boolean {
        return false;
    }

    get cancelled(): boolean {
        return false;
    }
}
