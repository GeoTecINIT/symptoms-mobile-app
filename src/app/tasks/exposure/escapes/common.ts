import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { Exposure } from "~/app/core/persistence/exposures";

export function checkIfProximityChangesInvolveOngoingExposure(
    changes: Array<AoIProximityChange>,
    ongoingExposure: Exposure
): "no-change" | "not-present" | "present" {
    if (!changes.length) {
        return "no-change";
    }

    const aois = changes.map((change) => change.aoi);

    if (
        ongoingExposure &&
        aois.find((aoi) => aoi.id === ongoingExposure.place.id)
    ) {
        return "present";
    } else {
        return "not-present";
    }
}
