import { Folder, knownFolders, path } from "@nativescript/core";
import { createRecordsExporter } from "@awarns/persistence";
import { createTracesExporter } from "@awarns/tracing";
import { ShareFile } from "@nativescript-community/ui-share-file";
import { Zip } from "@nativescript/zip";
import { getDeviceInfo } from "~/app/core/utils/app-info";

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
    const deviceData = getDeviceInfo();

    return file.writeText(JSON.stringify(deviceData));
}
