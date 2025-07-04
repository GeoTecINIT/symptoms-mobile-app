import { ApplicationSettings } from "@nativescript/core";

import { AreaOfInterest } from "@awarns/geofencing";
import { ContextualConditions } from "~/app/core/weather";
import { firebaseManager } from "../utils/firebase";
import { getLogger, Logger } from "../utils/logger";
import { setupAreasOfInterest } from "../framework/aois";
import { getUploadMetadata } from "../persistence/remote/common";
import { account, Account } from "~/app/core/account";
import { BehaviorSubject, Subject } from "rxjs";

export type Message = {
    event: string;
    name: string;
    title: string;
    body: string;
};

export interface ExtendedAreaOfInterest extends AreaOfInterest {
    contextualConditions: ContextualConditions;
    active: boolean;
}

export interface AppConfig {
    places: ExtendedAreaOfInterest[];
    messages: Message[];
}

const APP_CONFIG_COLLECTION = "app-configs";
const APP_CONFIG_KEY = "PATIENT_APP_CONFIG";
const PATIENT_MESSAGES_KEY = "PATIENT_MESSAGES";

export interface AppConfigController {
    aois: ExtendedAreaOfInterest[];
    messages: Message[];
    setupAppConfig();
}

export class AppConfigControllerImpl implements AppConfigController {
    private _appConfig: AppConfig;
    private logger: Logger;
    private isInitialized: boolean;

    constructor(private accountInfo: Account) {
        this._appConfig = ApplicationSettings.hasKey(APP_CONFIG_KEY)
            ? JSON.parse(ApplicationSettings.getString(APP_CONFIG_KEY))
            : null;
        this.isInitialized = false;
    }

    private aoisSubject: BehaviorSubject<ExtendedAreaOfInterest[]> =
        new BehaviorSubject([]);
    public aois$ = this.aoisSubject.asObservable();

    get aois(): ExtendedAreaOfInterest[] {
        return this._appConfig.places;
    }

    get messages(): Message[] {
        if (this._appConfig?.messages) {
            this.getLogger().info(
                `AppConfig messages: ${JSON.stringify(
                    this._appConfig.messages,
                    null,
                    2
                )}`
            );
        } else {
            this.getLogger().info("AppConfig messages: not loaded yet");
        }

        return this._appConfig.messages;
    }

    getIsPlaceActiveFromAoi(id: string): boolean {
        const aoi = this.aois.find((aoi) => aoi.id === id);
        return aoi ? aoi.active !== false : true;
    }

    getContextualConditionsFromAoi(id: string): ContextualConditions {
        const aoi = this.aois.find((aoi) => aoi.id === id);
        return aoi.contextualConditions;
    }

    // Fetch firestore document and keep AppConfig updated while the app is running
    async setupAppConfig() {
        if (this.isInitialized) return;

        const { patientId, studyId } = await getUploadMetadata(
            this.accountInfo
        );

        if (!patientId || !studyId)
            throw Error("AccountInfo not currently initialized");

        const configDoc = firebaseManager.firestore
            .collection(APP_CONFIG_COLLECTION)
            .doc(`${studyId}-${patientId}`);
        configDoc.onSnapshot((doc) => {
            if (!doc.exists) {
                this.getLogger().error(
                    `The config document for patient ${patientId} does not exists in app-configs collection`
                );
                return;
            }
            const appConfig = doc.data() as AppConfig;
            this._appConfig = appConfig;
            this.aoisSubject.next(appConfig.places);

            // Serialize and save app-config document
            const serializedAppConfig = JSON.stringify(this._appConfig);
            ApplicationSettings.setString(APP_CONFIG_KEY, serializedAppConfig);

            // Serialize and save messages separately
            const serializedMessages = JSON.stringify(this._appConfig.messages);

            this.getLogger().info(
                `AppConfig serialized messages: ${serializedMessages}`
            );

            ApplicationSettings.setString(
                PATIENT_MESSAGES_KEY,
                serializedMessages
            );

            this.getLogger().info("AppConfig loaded on device!");

            setupAreasOfInterest().catch((e) =>
                this.getLogger().error(
                    `Could not setup areas of interest. Reason: ${e}`
                )
            );
        });

        this.isInitialized = true;
    }

    reset() {
        this.isInitialized = false;
    }

    private getLogger() {
        if (!this.logger) {
            this.logger = getLogger("PatientProfileController");
        }

        return this.logger;
    }
}

export const appConfigController = new AppConfigControllerImpl(account);
