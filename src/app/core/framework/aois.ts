import { getLogger } from "~/app/core/utils/logger";
import {
    AreaOfInterest,
    areasOfInterest,
} from "@awarns/core/entities/aois";

export type AoIChangeListener = () => void;

const changeListeners: Array<AoIChangeListener> = [];

export function onAoIListUpdated(cb: AoIChangeListener) {
    changeListeners.push(cb);
}

export async function setupAreasOfInterest() {
    const logger = getLogger("AreasOfInterestManager");

    const currentAoIs = await areasOfInterest.getAll();
    const newAoIs: Array<AreaOfInterest> = [
        // Add your areas of interest here
    ];

    if (!aoisDidChange(currentAoIs, newAoIs)) {
        return;
    }
    await areasOfInterest.deleteAll();
    await areasOfInterest.insert(newAoIs);
    notifyAoIsDidChange();
    logger.info("Areas of interest updated");
}

function aoisDidChange(
    currentAoIs: Array<AreaOfInterest>,
    newAoIs: Array<AreaOfInterest>
): boolean {
    if (currentAoIs.length !== newAoIs.length) {
        return true;
    }

    const currentSorted = sort(currentAoIs);
    const newSorted = sort(newAoIs);

    for (let i = 0; i < currentSorted.length; i++) {
        if (currentSorted[i].id !== newSorted[i].id) {
            return true;
        }
    }

    return false;
}

function sort(aois: Array<AreaOfInterest>): Array<AreaOfInterest> {
    return [...aois].sort((aoi1, aoi2) => {
        if (aoi1.id < aoi2.id) {
            return -1;
        }
        if (aoi1.id > aoi2.id) {
            return 1;
        }

        return 0;
    });
}

function notifyAoIsDidChange() {
    for (const notify of changeListeners) {
        notify();
    }
}

export { AreaOfInterest, areasOfInterest };
