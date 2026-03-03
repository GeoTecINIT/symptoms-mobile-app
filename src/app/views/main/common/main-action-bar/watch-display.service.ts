import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class WatchDisplayService {
    private watchConnectedSource = new BehaviorSubject<boolean>(false);
    watchConnected$ = this.watchConnectedSource.asObservable();

    private watchAvailableSource = new BehaviorSubject<boolean>(false);
    watchAvailable$ = this.watchAvailableSource.asObservable();

    constructor() {}

    setWatchAvailable(isAvailable: boolean) {
        this.watchAvailableSource.next(isAvailable);
    }

    setWatchConnected(isConnected: boolean) {
        this.watchConnectedSource.next(isConnected);
    }

    // TODO: check
    getCurrentValue(): boolean {
        return this.watchConnectedSource.value;
    }
}
