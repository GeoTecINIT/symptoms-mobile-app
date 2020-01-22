import * as app from 'tns-core-modules/application';

class ExternalEventHandler {
    private initialized: boolean;
    private lastIntent: android.content.Intent;

    init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.setupExternalEventListener();
        console.log('External event handler configured!');
    }

    private setupExternalEventListener() {
        app.android.on(
            app.AndroidApplication.activityResumedEvent,
            this.externalEventListener
        );
    }

    private externalEventListener(args: app.AndroidActivityEventData) {
        const intent = args.activity.getIntent();
        if (intent === this.lastIntent) {
            return;
        }
        this.lastIntent = intent;
        console.log(intent);
        console.log(intent.getStringExtra('action'));
    }
}

export const externalEventHandler = new ExternalEventHandler();
