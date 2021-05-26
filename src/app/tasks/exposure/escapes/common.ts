import { AoIProximityChange } from "@geotecinit/emai-framework/entities/aois";
import { ExposuresStore } from "~/app/core/persistence/exposures";

export async function checkIfProximityChangesInvolveOngoingExposure(
    changes: Array<AoIProximityChange>,
    store: ExposuresStore
): Promise<"no-change" | "not-present" | "present"> {
    if (!changes.length) {
        return "no-change";
    }

    const aois = changes.map((change) => change.aoi);
    const ongoingExposure = await store.getLastUnfinished();

    if (
        ongoingExposure &&
        aois.find((aoi) => aoi.id === ongoingExposure.place.id)
    ) {
        return "present";
    } else {
        return "not-present";
    }
}
