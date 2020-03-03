// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { firebaseInstance } from './app/core/utils/firebase';

import { taskGraph } from './app/core/tasks/graph/loader';
import { demoTaskGraph } from './app/tasks/graph';

firebaseInstance.init();

taskGraph.load(demoTaskGraph);

platformNativeScriptDynamic().bootstrapModule(AppModule);
