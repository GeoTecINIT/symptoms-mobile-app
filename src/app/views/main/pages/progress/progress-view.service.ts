import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ProgressViewService {
    get idle(): boolean {
        return this._idle;
    }

    private _idle = true;

    switchIdleState() {
        this._idle = !this._idle;
    }

    setAsIdle() {
        this._idle = true;
    }
}
