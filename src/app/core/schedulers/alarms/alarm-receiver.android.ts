@JavaProxy('es.uji.geotec.symptomsapp.AlarmReceiver')
export class AlarmReceiver extends android.content.BroadcastReceiver {
    onReceive(
        context: android.content.Context,
        intent: android.content.Intent
    ) {
        console.log('Hellooo');
    }
}
