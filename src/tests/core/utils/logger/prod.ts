import { ProdLogger } from "~/app/core/utils/logger/prod";
import { FirebaseManager } from "~/app/core/utils/firebase";
import { Logger } from "~/app/core/utils/logger";

describe("Production logger", () => {
    const crashlytics = createCrashlyticsMock();
    const firebaseManager = createFirebaseManagerMock();
    const auxLogger = createLoggerMock();
    const logger = new ProdLogger("RandomTag", firebaseManager, auxLogger);

    it("silently discards debug logs", () => {
        spyOn(firebaseManager, "crashlytics");
        spyOn(auxLogger, "debug");
        logger.debug("Some message");
        expect(firebaseManager.crashlytics).not.toHaveBeenCalled();
        expect(auxLogger.debug).not.toHaveBeenCalled();
    });

    it("throws info logs through crashlytics if available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(crashlytics);
            });
        });

        spyOn(crashlytics, "log");
        logger.info("Some message");
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(crashlytics.log).toHaveBeenCalled();
    });

    it("prints info logs through auxiliary logger when crashlytics is not available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(null);
            });
        });

        spyOn(auxLogger, "info");
        logger.info("Some message");
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(auxLogger.info).toHaveBeenCalled();
    });

    it("throws warning logs through crashlytics if available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(crashlytics);
            });
        });

        spyOn(crashlytics, "log");
        logger.warn("Some message");
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(crashlytics.log).toHaveBeenCalled();
    });

    it("prints warning logs through auxiliary logger when crashlytics is not available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(null);
            });
        });

        spyOn(auxLogger, "warn");
        logger.warn("Some message");
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(auxLogger.warn).toHaveBeenCalled();
    });

    it("sends errors as crashlogs through crashlytics if available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(crashlytics);
            });
        });

        spyOn(crashlytics, "sendCrashLog");
        logger.error(new Error("Some error message"));
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(crashlytics.sendCrashLog).toHaveBeenCalled();
    });

    it("prints error logs through auxiliary logger when crashlytics is not available", async () => {
        const promise = new Promise((resolve) => {
            spyOn(firebaseManager, "crashlytics").and.callFake(() => {
                resolve();

                return Promise.resolve(null);
            });
        });

        spyOn(auxLogger, "error");
        logger.error(new Error("Some error message"));
        await promise;
        expect(firebaseManager.crashlytics).toHaveBeenCalled();
        expect(auxLogger.error).toHaveBeenCalled();
    });
});

function createCrashlyticsMock(): any {
    return {
        sendCrashLog() {
            return null;
        },
        log() {
            return null;
        },
    };
}

function createFirebaseManagerMock(): FirebaseManager {
    const firebaseManager = {
        crashlytics() {
            return Promise.resolve(null);
        },
    };

    return firebaseManager as FirebaseManager;
}

function createLoggerMock(): Logger {
    const logger = {
        debug(message: any) {
            return null;
        },
        info(message: any) {
            return null;
        },
        warn(message: any) {
            return null;
        },
        error(message: any) {
            return null;
        },
    };

    return logger as Logger;
}
