// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { firebaseManager } from './app/core/utils/firebase';

import { appTasks } from './app/tasks';
import { taskGraph } from './app/core/tasks/graph/loader';
import { demoTaskGraph } from './app/tasks/graph';
import { registerTasks } from './app/core/tasks/provider';

firebaseManager.init();

registerTasks(appTasks);
taskGraph.load(demoTaskGraph);

platformNativeScriptDynamic().bootstrapModule(AppModule);
