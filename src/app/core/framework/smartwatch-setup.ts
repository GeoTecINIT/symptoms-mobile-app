import {
    getConnectedWatches,
    setWatchFeaturesState,
    useWatch,
} from "@awarns/wear-os";

export async function setupWatchToUse(): Promise<void> {
    const watches = await getConnectedWatches();
    console.log("Watches detected: " + watches[0]);

    if (watches.length === 0) {
        setWatchFeaturesState(false);
        return;
    }

    const watch = watches[0];
    console.log(`Setup wear-os plugin to use ${watch.name} watch!`);
    setWatchFeaturesState(true);
    useWatch(watch);
}
