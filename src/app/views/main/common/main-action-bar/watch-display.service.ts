import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class WatchDisplayService {
    private watchConnectedSource = new BehaviorSubject<boolean>(false);
    watchConnected$ = this.watchConnectedSource.asObservable();

    constructor() {}

    setWatchConnected(isConnected: boolean) {
        this.watchConnectedSource.next(isConnected);
    }
}
