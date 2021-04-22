// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "@nativescript/angular";

import { AppModule } from "./app/app.module";

import { firebaseManager } from "./app/core/utils/firebase";

import { appTasks } from "./app/tasks";
import { demoTaskGraph } from "./app/tasks/graph";
import { getLogger } from "./app/core/utils/logger";
import { taskDispatcher } from "nativescript-task-dispatcher";

import { install } from "@nativescript-community/ui-chart";

firebaseManager.init();

taskDispatcher.init(appTasks, demoTaskGraph, { customLogger: getLogger });

install();

platformNativeScriptDynamic().bootstrapModule(AppModule);
