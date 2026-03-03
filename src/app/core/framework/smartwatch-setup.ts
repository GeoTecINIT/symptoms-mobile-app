import {
    getConnectedWatches,
    setWatchFeaturesState,
    useWatch,
    getWatchInUse,
    WatchSensor,
} from "@awarns/wear-os";
import { areWatchFeaturesEnabled } from "@awarns/wear-os/internal/setup";

import { Logger, getLogger } from "../utils/logger";
import { getCollectorManager } from "nativescript-wearos-sensors/collection";
import { toSensorType } from "@awarns/wear-os/internal/watch-sensor";

export async function handleWatchToUse(): Promise<void> {
    const logger: Logger = getLogger("WatchSetup");

    const watches = await getConnectedWatches();
    logger.info("Watches detected: " + watches.length);

    if (watches.length === 0) {
        logger.info("No watch is connected");
        setWatchFeaturesState(false);
        return;
    }

    const watch = watches[0];

    if (areWatchFeaturesEnabled()) {
        logger.info(`Disconnecting ${watch.name} watch.`);
        setWatchFeaturesState(false);
    } else {
        logger.info(`Connecting ${watch.name} watch.`);
        setWatchFeaturesState(true);
        useWatch(watch);
        getCollectorManager().isReady(
            watch,
            toSensorType(WatchSensor.HEART_RATE),
        );
    }
}

export async function isAnyWatchConnected(): Promise<boolean> {
    const watches = await getConnectedWatches();
    return watches.length > 0;
}

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
