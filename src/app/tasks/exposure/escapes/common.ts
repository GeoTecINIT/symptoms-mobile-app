import { AoIProximityChange } from "@awarns/core/entities/aois";
import { Exposure } from "~/app/core/persistence/exposures";

export function checkIfProximityChangesInvolveOngoingExposure(
    changes: Array<AoIProximityChange>,
    ongoingExposure: Exposure
): "no-change" | "not-ongoing" | "pre-started" | "ongoing" {
    if (!changes.length) {
        return "no-change";
    }

    const aois = changes.map((change) => change.aoi);

    if (
        !ongoingExposure ||
        !aois.find((aoi) => aoi.id === ongoingExposure.place.id)
    ) {
        return "not-ongoing";
    }

    if (!ongoingExposure.startTime) {
        return "pre-started";
    }

    return "ongoing";
}
