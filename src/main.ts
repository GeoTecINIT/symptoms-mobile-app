// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { firebaseManager } from './app/core/utils/firebase';

import { appTasks } from './app/tasks';
import { demoTaskGraph } from './app/tasks/graph';
import { taskDispatcher } from 'nativescript-task-dispatcher';

firebaseManager.init();

taskDispatcher.init(appTasks, demoTaskGraph, { enableLogging: true });

platformNativeScriptDynamic().bootstrapModule(AppModule);
