// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { on } from './app/core/events';
import { run } from './app/core/tasks';

let eventGraphCreated = false;
function createEventGraph() {
    if (eventGraphCreated) {
        return;
    }
    eventGraphCreated = true;
    console.log('main.ts: Creating event graph');
    on('startEvent', run('fastTask').every(60));
    on('startEvent', run('acquireGeolocation').every(60));
    on('startEvent', run('mediumTask').every(120));
    on('startEvent', run('slowTask').every(240));

    on('slowTaskFinished', run('mediumTask').now());
    on('mediumTaskFinished', run('fastTask').now());
    on('geolocationAcquired', run('printGeolocation').now());
}

createEventGraph();

platformNativeScriptDynamic().bootstrapModule(AppModule);
