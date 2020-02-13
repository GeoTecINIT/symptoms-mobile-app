import { Task, TaskConfig } from '../task';
import { Provider } from '../../providers/provider';

export class ProviderTask extends Task {
    constructor(
        name: string,
        private provider: Provider,
        taskConfig?: TaskConfig
    ) {
        super(name, taskConfig);
    }

    async checkIfCanRun(): Promise<void> {
        await this.provider.checkIfIsReady();
    }

    async prepare(): Promise<void> {
        await this.provider.prepare();
    }

    protected async onRun(): Promise<void> {
        await this.checkIfCanRun();
        const [recordPromise, stopRecording] = this.provider.next();
        this.setCancelFunction(() => stopRecording());
        const record = await recordPromise;
        this.done(`${record.type}Acquired`, { record });
    }
}
