import { AndroidAlarmManager } from '~/app/core/schedulers/alarms/alarm-manager.android';

describe('Android Alarm Manager', () => {
    let systemAlarmManager: android.app.AlarmManager;
    let alarmManager: AndroidAlarmManager;
    const interval = 60000;

    beforeEach(() => {
        systemAlarmManager = createOsAlarmManagerMock() as android.app.AlarmManager;
        alarmManager = new AndroidAlarmManager(systemAlarmManager, 23);
        spyOn(systemAlarmManager, 'setExactAndAllowWhileIdle');
        spyOn(systemAlarmManager, 'setExact');
        spyOn(systemAlarmManager, 'set');
        spyOn(systemAlarmManager, 'cancel');
    });

    it('sets an alarm with the given interval', () => {
        alarmManager.set(interval);
        expect(systemAlarmManager.setExactAndAllowWhileIdle).toHaveBeenCalled();
        expect(systemAlarmManager.setExact).not.toHaveBeenCalled();
        expect(systemAlarmManager.set).not.toHaveBeenCalled();
        expect(alarmManager.alarmUp).toBeTruthy();
    });

    it('sets an exact alarm when SDK version is over 18 and bellow 23', () => {
        alarmManager = new AndroidAlarmManager(systemAlarmManager, 20);
        alarmManager.set(interval);
        expect(
            systemAlarmManager.setExactAndAllowWhileIdle
        ).not.toHaveBeenCalled();
        expect(systemAlarmManager.setExact).toHaveBeenCalled();
        expect(systemAlarmManager.set).not.toHaveBeenCalled();
        expect(alarmManager.alarmUp).toBeTruthy();
    });

    it('sets a regular alarm when skd version is bellow 19', () => {
        alarmManager = new AndroidAlarmManager(systemAlarmManager, 17);
        alarmManager.set(interval);
        expect(
            systemAlarmManager.setExactAndAllowWhileIdle
        ).not.toHaveBeenCalled();
        expect(systemAlarmManager.setExact).not.toHaveBeenCalled();
        expect(systemAlarmManager.set).toHaveBeenCalled();
        expect(alarmManager.alarmUp).toBeTruthy();
    });

    it('cancels a scheduled alarm', () => {
        alarmManager.set(interval);
        alarmManager.cancel();
        expect(systemAlarmManager.cancel).toHaveBeenCalled();
        expect(alarmManager.alarmUp).not.toBeTruthy();
    });
});

function createOsAlarmManagerMock(): any {
    return {
        setExactAndAllowWhileIdle(
            p0: number,
            p1: number,
            p2: android.app.PendingIntent
        ): void {
            return;
        },
        setExact(p0: number, p1: number, p2: android.app.PendingIntent): void {
            return;
        },
        set(p0: number, p1: number, p2: android.app.PendingIntent): void {
            return;
        },
        cancel(p0: android.app.PendingIntent): void {
            return;
        }
    };
}
