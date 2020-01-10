import { schedule } from '~/app/core/schedulers';

describe('Schedule', () => {
    it('schedules a job in time', () => {
        const task = schedule(60, () => ({}));
        expect(task.scheduled).toBe(true);
    });
});
