@JavaProxy('es.uji.geotec.symptomsapp.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    interval: number;
    taskName: string;

    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        console.log('AlarmReceiver: Alarm trigger');

        // TODO: When no tasks to plan do nothing
        // TODO: Obtain fastest delay in order to plan next alarm trigger
        // TODO: Check if something needs to be executed in the foreground

        console.log('Work enqueued');
    }
}
