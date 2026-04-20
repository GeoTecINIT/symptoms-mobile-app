import { getConnectedWatches, WatchSensor } from "@awarns/wear-os";
import { getCollectorManager } from "nativescript-wearos-sensors/collection";
import { toSensorType } from "@awarns/wear-os/internal/watch-sensor";
import { Logger, getLogger } from "../utils/logger";

// This file only stores utility functions. Business logic lives in WatchDisplayService.

// Returns true if at least one watch is physically paired and visible to the
// phone right now. Does NOT check whether permissions have been granted.
export async function isAnyWatchConnected(): Promise<boolean> {
    const watches = await getConnectedWatches();
    return watches.length > 0;
}

// Returns true if the first paired watch has previously granted permissions
// for the heart-rate sensor (i.e. the sensor collector reports it is ready).
// Returns false if no watch is paired or if the collector is not ready.
export async function verifyWatchPermissionsActive(): Promise<boolean> {
    const logger: Logger = getLogger("WatchSetup");
    const watches = await getConnectedWatches();

    if (watches.length === 0) {
        logger.info("No watch connected for permission verification");
        return false;
    }

    const watch = watches[0];
    try {
        const isReady = await getCollectorManager().isReady(
            watch,
            toSensorType(WatchSensor.HEART_RATE),
        );
        logger.info(`Watch permissions active: ${isReady}`);
        return isReady;
    } catch (error) {
        logger.error("Error verifying watch permissions: " + error);
        return false;
    }
}
