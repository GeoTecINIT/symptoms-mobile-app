import { INTERVAL_KEY, TASK_NAME_KEY } from '..';

@JavaProxy('es.uji.geotec.symptomsapp.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    interval: number;
    taskName: string;

    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        this.interval = intent.getIntExtra(INTERVAL_KEY, 0);
        this.taskName = intent.getStringExtra(TASK_NAME_KEY);
        console.log('Hellooo');
    }
}
