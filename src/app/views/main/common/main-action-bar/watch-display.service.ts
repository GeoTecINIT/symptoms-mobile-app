import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, interval, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { getConnectedWatches } from "@awarns/wear-os";
import {
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os/internal/setup";
import { awarns } from "@awarns/core";
import {
    preparePlugin,
    verifyWatchPermissionsActive,
} from "~/app/core/framework";
import { getLogger, Logger } from "~/app/core/utils/logger";

export enum WatchStatus {
    // No watch physically paired/visible to the phone
    Unavailable = "unavailable",
    // Watch is physically paired but either:
    //   - permissions have never been granted on the watch, OR
    //   - the user deliberately tapped the icon to disable collection, OR
    //   - the physical connection was lost while the watch was Connected (bluetooth was turned off, too much time passed...)
    Available = "available",
    // Watch is paired AND permissions are granted AND user has enabled collection.
    // Heart rate data WILL be collected when an exposure starts.
    Connected = "connected",
}

// How often to poll getConnectedWatches() while status is Connected,
// to detect if the physical connection has been lost.
const POLL_INTERVAL_MS = 15_000;

@Injectable({
    providedIn: "root",
})
export class WatchDisplayService implements OnDestroy {
    private statusSource = new BehaviorSubject<WatchStatus>(
        WatchStatus.Unavailable,
    );
    status$ = this.statusSource.asObservable();

    // Derived observables kept for existing subscribers, but prefer subscribing to status$ for new code.
    watchAvailable$: Observable<boolean> = this.status$.pipe(
        map((s) => s !== WatchStatus.Unavailable),
    );
    watchConnected$: Observable<boolean> = this.status$.pipe(
        map((s) => s === WatchStatus.Connected),
    );

    private pollSubscription: Subscription | null = null;
    private initialized = false;
    private logger: Logger;

    constructor() {
        this.logger = getLogger("WatchDisplayService");
    }

    get currentStatus(): WatchStatus {
        return this.statusSource.value;
    }

    // Must be called once when the main view loads.
    // Checks whether a watch is physically present and, if so, whether
    // permissions were already granted in a previous session. If they
    // were, it restores the Connected state automatically (the user
    // does not need to tap the icon again after reopening the app)
    async initialize(): Promise<void> {
        if (this.initialized) return;
        this.initialized = true;

        const watches = await getConnectedWatches();
        if (watches.length === 0) {
            this.setStatus(WatchStatus.Unavailable);
            return;
        }

        let permissionsActive = false;
        try {
            permissionsActive = await verifyWatchPermissionsActive();
        } catch (e) {
            this.logger.error("Error checking watch permissions on init: " + e);
        }

        if (permissionsActive) {
            // Restore the fully-connected state from a previous session.
            useWatch(watches[0]);
            setWatchFeaturesState(true);
            this.setStatus(WatchStatus.Connected);
            this.startPolling();
        } else {
            // Watch is paired but we have no permissions
            // (first launch, OR
            // the user had previously disabled collection).
            this.setStatus(WatchStatus.Available);
        }
    }

    // Called form the settings modal "Escanear reloj" button
    // Re-checks whether a watch is physically in range and updates the status.
    // Does NOT attempt to reconnect on its own.
    async scanForWatch(): Promise<void> {
        const watches = await getConnectedWatches();
        if (watches.length === 0) {
            if (this.currentStatus === WatchStatus.Connected) {
                // The watch that was connected is now physically gone.
                setWatchFeaturesState(false);
                this.stopPolling();
                this.emitWatchDisconnectedEvent();
            }
            this.setStatus(WatchStatus.Unavailable);
        } else if (this.currentStatus === WatchStatus.Unavailable) {
            // A watch has appeared that wasn't visible before.
            this.setStatus(WatchStatus.Available);
        }
        // If already Available or Connected, the scan result doesn't change the status,
        // since those are governed by the user's explicit intent (tap).
    }

    // Called when the user taps the crossed-watch icon (status is Available).
    // Requests permissions on the watch if needed, then moves to Connected.
    // onPermissionsNeeded lets the caller show its own dialog without the
    // service depending on DialogsService.
    async connect(onPermissionsNeeded: () => Promise<void>): Promise<void> {
        const watches = await getConnectedWatches();
        if (watches.length === 0) {
            this.logger.info(
                "connect() called but no watch is physically paired",
            );
            this.setStatus(WatchStatus.Unavailable);
            return;
        }

        setWatchFeaturesState(true);
        useWatch(watches[0]);

        const isReady = await preparePlugin();
        if (!isReady) {
            // Permissions were denied on the watch.
            this.logger.info(
                "Watch permissions denied — reverting to Available",
            );
            setWatchFeaturesState(false);
            this.setStatus(WatchStatus.Available);
            await onPermissionsNeeded();
            return;
        }

        this.setStatus(WatchStatus.Connected);
        this.startPolling();
        awarns.emitEvent("sendWatchConnectedMessage", {
            plainMessage: { message: "Permissions granted" },
        });
    }

    // Called when the user taps the uncrossed-watch icon (status is Connected).
    // Deliberately disables heart rate collection. Status goes to Available
    // (not Unavailable) because the watch is still physically paired,
    // meaning the user can re-enable by tapping again without re-granting permissions.
    async disconnect(): Promise<void> {
        setWatchFeaturesState(false);
        this.stopPolling();
        this.setStatus(WatchStatus.Available);
        this.emitWatchDisconnectedEvent();
    }

    // LEGACY SETTERS
    // Kept so that any code outside of this service that calls them doesn't break.
    // Prefer using connect() / disconnect() / scanForWatch() for new code.

    setWatchAvailable(isAvailable: boolean) {
        if (!isAvailable) {
            if (this.currentStatus === WatchStatus.Connected) {
                this.stopPolling();
            }
            this.setStatus(WatchStatus.Unavailable);
        } else if (this.currentStatus === WatchStatus.Unavailable) {
            this.setStatus(WatchStatus.Available);
        }
    }

    setWatchConnected(isConnected: boolean) {
        if (isConnected) {
            this.setStatus(WatchStatus.Connected);
            this.startPolling();
        } else if (this.currentStatus === WatchStatus.Connected) {
            this.stopPolling();
            this.setStatus(WatchStatus.Available);
        }
    }

    // this is deprecated, use status$ instead
    getCurrentValue(): boolean {
        return this.currentStatus === WatchStatus.Connected;
    }

    ngOnDestroy() {
        this.stopPolling();
    }

    // PRIVATE

    private setStatus(next: WatchStatus) {
        const prev = this.statusSource.value;
        if (prev === next) return;
        this.logger.info(`WatchStatus: ${prev} → ${next}`);
        this.statusSource.next(next);
    }

    // Polls getConnectedWatches() every POLL_INTERVAL_MS while Connected.
    // If the watch disappears (out of range, turned off...), falls back to
    // Available so the user knows they need to tap the icon again.
    private startPolling() {
        this.stopPolling();
        this.pollSubscription = interval(POLL_INTERVAL_MS).subscribe(
            async () => {
                if (this.currentStatus !== WatchStatus.Connected) {
                    this.stopPolling();
                    return;
                }
                const watches = await getConnectedWatches();
                if (watches.length === 0) {
                    this.logger.info(
                        "Poll: watch physically disconnected — reverting to Available",
                    );
                    setWatchFeaturesState(false);
                    this.stopPolling();
                    this.setStatus(WatchStatus.Available);
                    this.emitWatchDisconnectedEvent();
                }
            },
        );
    }

    private stopPolling() {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
            this.pollSubscription = null;
        }
    }

    private emitWatchDisconnectedEvent() {
        awarns.emitEvent("sendWatchNotConnectedMessage", {
            plainMessage: { message: "Permissions denied" },
        });
    }
}
