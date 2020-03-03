import { Logger } from './common';
import { FirebaseManager, firebaseInstance } from '../firebase';
import { DevLogger } from './dev';
import { isAndroid } from 'tns-core-modules/platform';

export class ProdLogger extends Logger {
    constructor(
        tag: string,
        private firebase: FirebaseManager = firebaseInstance,
        private auxLogger: Logger = new DevLogger(tag)
    ) {
        super(tag);
    }

    protected logDebug(message: string): void {
        return; // Do not print or send debug messages in production
    }

    protected async logInfo(message: string): Promise<void> {
        const crashlytics = await this.firebase.crashlytics();
        if (crashlytics) {
            crashlytics.log(message);
        } else {
            this.auxLogger.info(message);
        }
    }

    protected async logWarning(message: string): Promise<void> {
        const crashlytics = await this.firebase.crashlytics();
        if (crashlytics) {
            crashlytics.log(message);
        } else {
            this.auxLogger.warn(message);
        }
    }

    protected async logError(message: string): Promise<void> {
        const crashlytics = await this.firebase.crashlytics();
        if (!crashlytics) {
            this.auxLogger.error(message);

            return;
        }

        if (isAndroid) {
            crashlytics.sendCrashLog(new java.lang.Exception(message));
        } else {
            crashlytics.sendCrashLog(
                new NSError({
                    domain: 'es.uji.geotec.symptomsapp',
                    code: 42,
                    userInfo: NSDictionary.dictionaryWithObjectsAndKeys<
                        string,
                        string
                    >({
                        NSLocalizedUserMessage: message
                    })
                })
            );
        }
    }
}
