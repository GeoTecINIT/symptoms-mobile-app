import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";
import { NavigationService } from "~/app/views/navigation.service";
import { AppSettingsService } from "~/app/views/app-settings.service";
import { DialogsService } from "~/app/views/common/dialogs.service";

import { preparePlugin } from "~/app/core/framework";
import { emitTreatmentStartEvent } from "~/app/core/framework/events";

import { infoOnPermissionsNeed } from "~/app/core/dialogs/info";
import { getLogger, Logger } from "~/app/core/utils/logger";
import { autoStarter } from "nativescript-autostarter";

import {
    Application,
    AndroidApplication,
    AndroidActivityRequestPermissionsEventData,
    isAndroid,
} from "@nativescript/core";

declare const android: any, androidx: any;

@Component({
    selector: "SymTutorial",
    templateUrl: "./tutorial.component.html",
    styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent implements OnInit {
    private logger: Logger;
    private static readonly BT_PERMISSION_REQUEST_CODE = 1001;
    private static readonly LOCATION_PERMISSION_REQUEST_CODE = 1002;
    private static readonly BACKGROUND_LOCATION_PERMISSION_REQUEST_CODE = 1003;

    constructor(
        private inAppBrowserService: InAppBrowserService,
        private navigationService: NavigationService,
        private appSettingsService: AppSettingsService,
        private dialogsService: DialogsService,
        private activeRoute: ActivatedRoute
    ) {
        this.logger = getLogger("TutorialComponent");
    }

    ngOnInit() {
        this.appSettingsService.reloadPatientInfo().catch((e) => {
            this.logger.error(
                `Could not load patient information. Reason: ${e}`
            );
        });
    }

    onOpenProjectWebsiteTap() {
        this.inAppBrowserService.openProjectWebSite();
    }

    onOpenPrivacyPolicyTap() {
        this.inAppBrowserService.openPrivacyPolicy();
    }

    async onConfigureTap() {
        const hasLocationPermissions =
            await this.ensureLocationPermissionsIfNeeded();
        if (!hasLocationPermissions) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }
        const hasBluetoothPermissions =
            await this.ensureBluetoothPermissionsIfNeeded();
        if (!hasBluetoothPermissions) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }

        const done = await preparePlugin();
        if (!done) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }

        emitTreatmentStartEvent();
        this.appSettingsService.markSetupAsComplete();
        this.navigationService.navigate(["../setup-confirmation"], {
            source: this.activeRoute,
            clearHistory: true,
        });
    }

    async launchAutostarterIfNeeded() {
        const autoStarterManager = autoStarter.getManager();
        const available = autoStarterManager.canShowAutoStartDialogRequest();
        // this.logger.info(`Can show dialog request: ${available}`);

        if (available) {
            const dialogResponse =
                await autoStarterManager.showAutoStartDialogRequest();
            // this.logger.info(`Dialog response: ${dialogResponse}`);
        }
    }

    async proceedWithSetup() {
        const hasLocationPermissions =
            await this.ensureLocationPermissionsIfNeeded();
        if (!hasLocationPermissions) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }

        const hasBluetoothPermissions =
            await this.ensureBluetoothPermissionsIfNeeded();
        if (!hasBluetoothPermissions) {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
            return;
        }

        const setupComplete = await preparePlugin();
        if (setupComplete) {
            emitTreatmentStartEvent();
            this.appSettingsService.markSetupAsComplete();
            this.navigationService.navigate(["../setup-confirmation"], {
                source: this.activeRoute,
                clearHistory: true,
            });
        } else {
            this.dialogsService.showInfo(infoOnPermissionsNeed);
        }
    }

    private async ensureBluetoothPermissionsIfNeeded(): Promise<boolean> {
        if (!isAndroid) {
            return true;
        }

        const sdkVersion = android.os.Build.VERSION.SDK_INT;
        if (sdkVersion < 31) {
            // No runtime BT permissions before Android 12
            return true;
        }

        const activity =
            Application.android.foregroundActivity ||
            Application.android.startActivity;

        if (!activity) {
            this.logger.warn(
                "No Android activity available to request Bluetooth permissions"
            );
            return false;
        }

        const perms = [
            android.Manifest.permission.BLUETOOTH_CONNECT,
            android.Manifest.permission.BLUETOOTH_SCAN,
            android.Manifest.permission.BLUETOOTH_ADVERTISE,
        ];

        const PackageManager = android.content.pm.PackageManager;
        let allGranted = true;

        for (let i = 0; i < perms.length; i++) {
            const permission = perms[i];
            const hasPermission =
                activity.checkSelfPermission(permission) ===
                PackageManager.PERMISSION_GRANTED;
            if (!hasPermission) {
                allGranted = false;
                break;
            }
        }

        if (allGranted) {
            return true;
        }

        this.logger.info("Requesting Bluetooth runtime permissions");

        return this.requestPermissions(
            activity,
            perms,
            TutorialComponent.BT_PERMISSION_REQUEST_CODE
        );
    }

    private async ensureLocationPermissionsIfNeeded(): Promise<boolean> {
        if (!isAndroid) {
            return true;
        }

        const sdkVersion = android.os.Build.VERSION.SDK_INT;
        if (sdkVersion < 23) {
            // No runtime permissions before Android 6
            return true;
        }

        const activity =
            Application.android.foregroundActivity ||
            Application.android.startActivity;

        if (!activity) {
            this.logger.warn(
                "No Android activity available to request location permissions"
            );
            return false;
        }

        const PackageManager = android.content.pm.PackageManager;

        const fine = android.Manifest.permission.ACCESS_FINE_LOCATION;
        const coarse = android.Manifest.permission.ACCESS_COARSE_LOCATION;
        const background =
            android.Manifest.permission.ACCESS_BACKGROUND_LOCATION;

        const hasPermission = (perm: string) =>
            activity.checkSelfPermission(perm) ===
            PackageManager.PERMISSION_GRANTED;

        // 1) Foreground location (fine/coarse)
        let hasForegroundLocation =
            hasPermission(fine) || hasPermission(coarse);

        if (!hasForegroundLocation) {
            this.logger.info("Requesting foreground location permissions");
            const foregroundGranted = await this.requestPermissions(
                activity,
                [fine],
                TutorialComponent.LOCATION_PERMISSION_REQUEST_CODE
            );

            if (!foregroundGranted) {
                return false;
            }

            hasForegroundLocation =
                hasPermission(fine) || hasPermission(coarse);
        }

        if (!hasForegroundLocation) {
            return false;
        }

        // 2) Background location (Android 10+), needed if the location
        //    FGS might be started while the app is not visible.
        if (sdkVersion >= 29 && !hasPermission(background)) {
            this.logger.info("Requesting background location permission");
            const backgroundGranted = await this.requestPermissions(
                activity,
                [background],
                TutorialComponent.BACKGROUND_LOCATION_PERMISSION_REQUEST_CODE
            );

            if (!backgroundGranted) {
                // Without background location, a location-type FGS started
                // from the background can still crash on Android 14.
                return false;
            }
        }

        return true;
    }

    private requestPermissions(
        activity: android.app.Activity,
        perms: string[],
        requestCode: number
    ): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const eventName = "activityRequestPermissions";

            const onPermissionResult = (
                args: AndroidActivityRequestPermissionsEventData
            ) => {
                if (args.requestCode === requestCode) {
                    Application.android.off(eventName, onPermissionResult);

                    const grantResults = args.grantResults;
                    if (!grantResults || grantResults.length === 0) {
                        this.logger.warn(
                            `Permissions request ${requestCode} cancelled or empty result`
                        );
                        resolve(false);
                        return;
                    }

                    const pm = android.content.pm.PackageManager;

                    let granted = true;
                    for (let i = 0; i < grantResults.length; i++) {
                        if (grantResults[i] !== pm.PERMISSION_GRANTED) {
                            granted = false;
                            break;
                        }
                    }

                    this.logger.info(
                        `Permissions request ${requestCode} granted: ${granted}`
                    );
                    resolve(granted);
                }
            };

            Application.android.on(eventName, onPermissionResult);

            const ActivityCompat = androidx.core.app.ActivityCompat;
            ActivityCompat.requestPermissions(activity, perms, requestCode);
        });
    }
}
