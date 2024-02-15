// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {
    platformNativeScript,
    runNativeScriptAngularApp,
} from "@nativescript/angular";

import { AppModule } from "./app/app.module";

import { firebaseManager } from "./app/core/utils/firebase";

import { awarns } from "@awarns/core";
import { appTasks } from "./app/tasks";
import { appTaskGraph } from "./app/tasks/graph";
import { registerHumanActivityPlugin } from "@awarns/human-activity";
import { registerNotificationsPlugin } from "@awarns/notifications";
import { registerPersistencePlugin } from "@awarns/persistence";
import { registerTracingPlugin } from "@awarns/tracing";

import { remoteRecords, remoteTraces } from "./app/core/persistence/remote";
import { getLogger } from "./app/core/utils/logger";

import { install } from "@nativescript-community/ui-chart";
import { WatchSensor, registerWearOSPlugin } from "@awarns/wear-os";

firebaseManager
    .init()
    .catch((e) =>
        console.error("Could not initialize Firebase manager. Reason:", e)
    );
firebaseManager
    .enableUsageDataCollection()
    .catch((e) =>
        console.error(
            "Could not enable firebase usage data collection. Reason:",
            e
        )
    );

awarns
    .init(
        appTasks,
        appTaskGraph,
        [
            registerHumanActivityPlugin(),
            registerNotificationsPlugin(),
            registerPersistencePlugin({
                externalRecordsStore: remoteRecords,
            }),
            registerTracingPlugin({
                externalTracesStore: remoteTraces,
                oldTracesMaxAgeHours: 24 * 7 /* one week */,
            }),
            registerWearOSPlugin({
                sensors: [WatchSensor.HEART_RATE],
                enablePlainMessaging: true,
                enableWearCommands: true,
            }),
        ],
        {
            customLogger: getLogger,
        }
    )
    .catch((e) =>
        console.error("Could not initialize EMA/I framework. Reason:", e)
    );

install();

runNativeScriptAngularApp({
    appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
