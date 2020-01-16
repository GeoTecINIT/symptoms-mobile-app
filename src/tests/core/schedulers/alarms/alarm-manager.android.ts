import { AndroidAlarmManager } from '~/app/core/schedulers/alarms/alarm-manager.android';

describe('Android Alarm Manager', () => {
    let systemAlarmManager: android.app.AlarmManager;
    let alarmManager: AndroidAlarmManager;
    const interval = 60000;

    beforeEach(() => {
        systemAlarmManager = ({} as any) as android.app.AlarmManager;
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
    });

    it('sets an exact alarm when SDK version is over 18 and bellow 23', () => {
        alarmManager = new AndroidAlarmManager(systemAlarmManager, 20);
        alarmManager.set(interval);
        expect(
            systemAlarmManager.setExactAndAllowWhileIdle
        ).not.toHaveBeenCalled();
        expect(systemAlarmManager.setExact).toHaveBeenCalled();
        expect(systemAlarmManager.set).not.toHaveBeenCalled();
    });

    it('sets a regular alarm when skd version is bellow 19', () => {
        alarmManager = new AndroidAlarmManager(systemAlarmManager, 17);
        alarmManager.set(interval);
        expect(
            systemAlarmManager.setExactAndAllowWhileIdle
        ).not.toHaveBeenCalled();
        expect(systemAlarmManager.setExact).not.toHaveBeenCalled();
        expect(systemAlarmManager.set).toHaveBeenCalled();
    });

    it('cancels a scheduled alarm', () => {
        alarmManager.set(interval);
        alarmManager.cancel();
        expect(systemAlarmManager.cancel).toHaveBeenCalled();
    });
});
