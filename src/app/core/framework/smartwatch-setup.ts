import {
    getConnectedWatches,
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os";
import { areWatchFeaturesEnabled } from "@awarns/wear-os/internal/setup";

import { Logger, getLogger } from "../utils/logger";

export async function handleWatchToUse(): Promise<void> {
    const logger: Logger = getLogger("WatchSetup");

    const watches = await getConnectedWatches();
    logger.info("Watches detected: " + watches.length);

    if (watches.length === 0) {
        logger.info("No watch is connected");
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
    }
}
