import { Folder, isAndroid, knownFolders, path } from "@nativescript/core";
import {
    createRecordsExporter,
    createTracesExporter,
} from "@geotecinit/emai-framework/storage/exporters";
import { ShareFile } from "@nativescript-community/ui-share-file";
import { Zip } from "@nativescript/zip";

const EXPORTS_FOLDER = "exports";

export async function exportData(exportWindowTitle: string): Promise<string> {
    const exportsFolder = knownFolders.temp().getFolder(EXPORTS_FOLDER);

    await createRecordsExporter(exportsFolder, "csv", "records").export();
    await createRecordsExporter(exportsFolder, "json", "records").export();

    await createTracesExporter(exportsFolder, "csv", "traces").export();
    await createTracesExporter(exportsFolder, "json", "traces").export();

    await exportDeviceInfo(exportsFolder, "device-info");

    const zipPath = path.join(
        knownFolders.temp().path,
        `symptoms-data-${Date.now()}.zip`
    );

    await Zip.zip({
        directory: exportsFolder.path,
        archive: zipPath,
    });

    const shareFile = new ShareFile();
    try {
        await shareFile.open({
            path: zipPath,
            title: exportWindowTitle,
        });
    } catch (e) {
        console.error(e);
    }

    return zipPath;
}

function exportDeviceInfo(folder: Folder, fileName: string): Promise<void> {
    const file = folder.getFile(`${fileName}.json`);
    const deviceData = getDeviceData();

    return file.writeText(JSON.stringify(deviceData));
}

function getDeviceData(): DeviceData {
    if (isAndroid) {
        return {
            manufacturer: `${android.os.Build.MANUFACTURER}`,
            model: `${android.os.Build.MODEL}`,
            osVersion: `${android.os.Build.VERSION.RELEASE}`,
        };
    }

    return null;
}

interface DeviceData {
    manufacturer: string;
    model: string;
    osVersion: string;
}
