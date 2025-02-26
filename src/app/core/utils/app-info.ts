import { Application, isAndroid } from "@nativescript/core";
import { android as AndroidApplication } from "@nativescript/core/application";

export function getPackageName(): string {
    if (isAndroid) {
        const context =
            AndroidApplication.context || Application.android.nativeApp;
        return context.getPackageName();
    } else {
        return NSBundle.mainBundle.bundleIdentifier;
    }
}

export function getDeviceInfo(): DeviceInfo {
    if (isAndroid) {
        return {
            os: isAndroid ? "android" : "ios",
            manufacturer: `${android.os.Build.MANUFACTURER}`,
            model: `${android.os.Build.MODEL}`,
            osVersion: `${android.os.Build.VERSION.RELEASE}`,
        };
    }

    return null;
}

export interface DeviceInfo {
    os: string;
    manufacturer: string;
    model: string;
    osVersion: string;
}

export function getVersionName(): string {
    if (isAndroid) {
        const PackageManager = android.content.pm.PackageManager;
        const context =
            AndroidApplication.context || Application.android.nativeApp;
        const pkg = context
            .getPackageManager()
            .getPackageInfo(
                context.getPackageName(),
                PackageManager.GET_META_DATA
            );

        return pkg.versionName;
    } else {
        return NSBundle.mainBundle.objectForInfoDictionaryKey(
            "CFBundleVersion"
        ) as string;
    }
}
