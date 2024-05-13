import {
    getConnectedWatches,
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os";
import { Logger, getLogger } from "../utils/logger";

export async function setupWatchToUse(): Promise<void> {
    const logger: Logger = getLogger("WatchSetup")

    const watches = await getConnectedWatches();
    logger.info("Watches detected: " + watches.length);
    
    if (watches.length === 0) {
        logger.info("No watch is configured");
        setWatchFeaturesState(false);
        return;
    }

    const watch = watches[0];
    logger.info(`Setup wear-os plugin to use ${watch.name} watch!`);
    setWatchFeaturesState(true);
    useWatch(watch);
}
