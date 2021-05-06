// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "@nativescript/angular";

import { AppModule } from "./app/app.module";

import { firebaseManager } from "./app/core/utils/firebase";

import { appTasks } from "./app/tasks";
import { demoTaskGraph } from "./app/tasks/graph";
import { getLogger } from "./app/core/utils/logger";
import { emaiFramework } from "@geotecinit/emai-framework";

import { install } from "@nativescript-community/ui-chart";

firebaseManager
    .init()
    .catch((e) =>
        console.error("Could not initialize Firebase manager. Reason:", e)
    );

emaiFramework
    .init(appTasks, demoTaskGraph, { customLogger: getLogger })
    .catch((e) =>
        console.error("Could not initialize EMA/I framework. Reason:", e)
    );

install();

platformNativeScriptDynamic().bootstrapModule(AppModule);
