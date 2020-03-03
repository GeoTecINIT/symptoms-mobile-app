import { firebaseInstance } from '~/app/core/utils/firebase';

describe('Firebase manager', () => {
    it('returns crashlytics instance when user has given data collection consent', async () => {
        await firebaseInstance.enableUsageDataCollection();
        const crashlytics = await firebaseInstance.crashlytics();
        expect(crashlytics).not.toBeNull();
    });

    it('returns null when asking for crashlytics instance and no consent has been given', async () => {
        await firebaseInstance.disableUsageDataCollection();
        const crashlytics = await firebaseInstance.crashlytics();
        expect(crashlytics).toBeNull();
    });
});
