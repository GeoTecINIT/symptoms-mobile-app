import { getLogger } from "~/app/core/utils/logger";
import { AreaOfInterest, areasOfInterest } from "@awarns/geofencing";
import { ApplicationSettings } from "@nativescript/core";
import { ExtendedAreaOfInterest } from "../account/app-config";

const APP_CONFIG_KEY = "PATIENT_APP_CONFIG";

export async function setupAreasOfInterest() {
    const logger = getLogger("AreasOfInterestManager");

    const currentAoIs = await areasOfInterest.getAll();
    const appConfig = ApplicationSettings.getString(APP_CONFIG_KEY);

    const newAoIs: ExtendedAreaOfInterest[] = JSON.parse(
        appConfig
    ).places.filter((a: ExtendedAreaOfInterest) => a.active);

    if (!aoisDidChange(currentAoIs, newAoIs)) {
        return;
    }
    await areasOfInterest.deleteAll();
    await areasOfInterest.insert(newAoIs);
    logger.info("Areas of interest updated");
}

function aoisDidChange(
    currentAoIs: Array<AreaOfInterest>,
    newAoIs: Array<AreaOfInterest>
): boolean {
    if (currentAoIs.length !== newAoIs.length) {
        return true;
    }

    const currentAoisHash = JSON.stringify(
        currentAoIs.map((aoi) => ({
            name: aoi.name,
            latitude: aoi.latitude,
            longitude: aoi.longitude,
            radius: aoi.radius,
        }))
    );

    const newAoisHash = JSON.stringify(
        newAoIs.map((aoi) => ({
            name: aoi.name,
            latitude: aoi.latitude,
            longitude: aoi.longitude,
            radius: aoi.radius,
        }))
    );

    return currentAoisHash !== newAoisHash;
}
