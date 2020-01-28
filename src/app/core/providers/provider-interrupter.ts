export class ProviderInterrupter {
    set interruption(f: ProviderInterruption) {
        this._interruption = f;
    }

    interrupt() {
        this._interruption();
    }

    private _interruption = () => null;
}

export type ProviderInterruption = () => void;
