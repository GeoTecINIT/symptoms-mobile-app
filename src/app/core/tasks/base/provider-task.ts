import { Task, TaskConfig } from '../task';
import { Provider } from '../../providers/provider';

export class ProviderTask extends Task {
    constructor(
        name: string,
        private provider: Provider,
        taskConfig: TaskConfig = { foreground: false }
    ) {
        super(name, taskConfig);
    }

    protected onRun(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
