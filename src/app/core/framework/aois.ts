import { getLogger } from "~/app/core/utils/logger";
import {
    AreaOfInterest,
    areasOfInterest,
} from "@awarns/geofencing";

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
        /*{
            id: "ayunt",
            name: "Ayuntamiento de Moró",
            latitude: 40.060119294751814,
            longitude: -0.1395660638809204,
            radius: 45,
        },
        {
            id: "correos",
            name: "Oficina de correos",
            latitude: 40.061375646418675,
            longitude: -0.13784945011138916,
            radius: 30,
        },
        {
            id: "plaza-alcalde",
            name: "Plaza del alcalde Andreu",
            latitude: 40.059889371677656,
            longitude: -0.13769656419754028,
            radius: 30,
        },
        {
            id: "pistas-padel",
            name: "Pistas de pádel",
            latitude: 40.060689993315115,
            longitude: -0.12877017259597778,
            radius: 40,
        },
        {
            id: "casa",
            name: "Casa",
            latitude: 40.062656608580205,
            longitude: -0.13733983039855957,
            radius: 30,
        },*/
        {
            id: "espaitec-2",
            name: "Espaitec 2",
            latitude: 39.99372760266952,
            longitude: -0.07367491722106934,
            radius: 50,
        },
        {
            id: "agora-uji",
            name: "Ágora UJI",
            latitude: 39.99463379875606,
            longitude: -0.06891131401062012,
            radius: 80,
        },
        {
            id: "parking-eba",
            name: "P. Edificio Bellas Artes",
            latitude: 40.350722,
            longitude: -1.111,
            radius: 25,
        },
        {
            id: "puerto-valencia",
            name: "Puerto de Valencia",
            latitude: 39.459807,
            longitude: -0.331645,
            radius: 25,
        },
        {
            id: "parq-inf-auditorio",
            name: "Parque infantil Auditorio",
            latitude: 39.992361,
            longitude: -0.024889,
            radius: 30,
        },
        {
            id: "carlos-1",
            name: "Carlos 1",
            latitude: 39.87094,
            longitude: -0.065289,
            radius: 40,
        },
        /*{
            id: "mas-y-más",
            name: "Más y más",
            latitude: 40.062090032132964,
            longitude: -0.13797283172607422,
            radius: 40,
        },*/
        /*{
            id: "lugar 1",
            name: "Lugar 1",
            latitude: 0,
            longitude: 0,
            radius: 0,
        },
        {
            id: "lugar 2",
            name: "Lugar 2",
            latitude: 0,
            longitude: 0,
            radius: 0,
        },
        {
            id: "lugar 3",
            name: "Lugar 3",
            latitude: 0,
            longitude: 0,
            radius: 0,
        },
        {
            id: "fake-place1",
            name: "Lugar falso",
            latitude: 0,
            longitude: 0,
            radius: 0,
        },*/
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
