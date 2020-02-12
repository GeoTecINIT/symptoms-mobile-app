// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { taskTreeLoader } from './app/core/tasks/tree/loader';
import { taskTree } from './app/tasks/tree';

taskTreeLoader.load(taskTree);

platformNativeScriptDynamic().bootstrapModule(AppModule);
