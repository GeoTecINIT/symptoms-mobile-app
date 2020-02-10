import { Task, TaskConfig } from '../task';
import { Provider } from '../../providers/provider';

export class ProviderTask extends Task {
    private _provider: Provider;

    constructor(name: string, provider: Provider, taskConfig?: TaskConfig) {
        super(name, taskConfig);
        this._provider = provider;
    }

    get provider(): Provider {
        return this._provider;
    }

    protected async checkIfCanRun(): Promise<void> {
        await this.provider.checkIfIsReady();
    }

    protected async onRun(): Promise<void> {
        await this.checkIfCanRun();
        const [recordPromise, stopRecording] = this.provider.next();
        this.setCancelFunction(() => stopRecording());
        const record = await recordPromise;
        this.done(`${record.type}Acquired`, { record });
    }
}
