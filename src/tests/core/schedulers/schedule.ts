import { schedule, initializeScheduler } from '~/app/core/schedulers';

describe('Schedule', () => {
    it('schedules a job in time', () => {
        initializeScheduler(false);
        const task = schedule(60, () => ({}));
        expect(task.scheduled).toBe(true);
    });
});
