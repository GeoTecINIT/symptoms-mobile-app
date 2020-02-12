import { Task, TaskConfig } from '../task';
import { Provider } from '../../providers/provider';

export class ProviderTask extends Task {
    private _provider: Provider;

    constructor(name: string, provider: Provider, taskConfig?: TaskConfig) {
        super(name, taskConfig);
        this._provider = provider;
    }

    // TODO: Perhaps this is no longer needed
    get provider(): Provider {
        return this._provider;
    }

    async checkIfCanRun(): Promise<void> {
        await this.provider.checkIfIsReady();
    }

    async prepare(): Promise<void> {
        await this._provider.prepare();
    }

    protected async onRun(): Promise<void> {
        await this.checkIfCanRun();
        const [recordPromise, stopRecording] = this.provider.next();
        this.setCancelFunction(() => stopRecording());
        const record = await recordPromise;
        this.done(`${record.type}Acquired`, { record });
    }
}
