import * as app from 'tns-core-modules/application';
import { Logger } from '../utils/logger/common';
import { getLogger } from '../utils/logger';

// FIXME: This class only serves as a demonstrator of what is possible.
// It should be modified in order to allow subscribing to filtered
// external events, limited to domain events
class ExternalEventHandler {
    private initialized: boolean;
    private lastIntent: android.content.Intent;

    private logger: Logger;

    constructor() {
        this.logger = getLogger('ExternalEventHandler');
    }

    init() {
        if (this.initialized) {
            return;
        }

        this.setupExternalEventListener();
        this.logger.debug('Configured!');
    }

    private setupExternalEventListener() {
        app.android.on(app.AndroidApplication.activityResumedEvent, (args) =>
            this.externalEventListener(args)
        );
    }

    private externalEventListener(args: app.AndroidActivityEventData) {
        const intent = args.activity.getIntent();
        if (intent === this.lastIntent) {
            return;
        }
        this.lastIntent = intent;
        this.logger.debug(`${intent}`);
        console.log(intent.getStringExtra('action'));
    }
}

export const externalEventHandler = new ExternalEventHandler();
