// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {
    platformNativeScript,
    runNativeScriptAngularApp,
} from "@nativescript/angular";

import { AppModule } from "./app/app.module";

import { appEvents } from "~/app/core/app-events";

import { firebaseManager } from "./app/core/utils/firebase";

import { appTasks } from "./app/tasks";
import { demoTaskGraph } from "./app/tasks/graph";
import { getLogger } from "./app/core/utils/logger";
import { remoteRecords, remoteTraces } from "~/app/core/persistence/remote";
import { awarns } from "@awarns/core";

import { install } from "@nativescript-community/ui-chart";

appEvents.listen();

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
    .init(appTasks, demoTaskGraph, {
        externalRecordsStore: remoteRecords,
        externalTracesStore: remoteTraces,
        oldTracesMaxAgeHours: 24 * 7 /* one week */,
        customLogger: getLogger,
    })
    .catch((e) =>
        console.error("Could not initialize EMA/I framework. Reason:", e)
    );

install();

runNativeScriptAngularApp({
    appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
