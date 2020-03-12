import { firebaseManager } from '~/app/core/utils/firebase';

describe('Firebase manager', () => {
    it('returns crashlytics instance when user has given data collection consent', async () => {
        await firebaseManager.enableUsageDataCollection();
        const crashlytics = await firebaseManager.crashlytics();
        expect(crashlytics).not.toBeNull();
    });

    it('returns null when asking for crashlytics instance and no consent has been given', async () => {
        await firebaseManager.disableUsageDataCollection();
        const crashlytics = await firebaseManager.crashlytics();
        expect(crashlytics).toBeNull();
    });
});
