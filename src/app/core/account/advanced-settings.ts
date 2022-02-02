import { ApplicationSettings } from "@nativescript/core";

const ADVANCED_SETTINGS_PREFIX = "ADV_SETTINGS_";

export enum AdvancedSetting {
    PanicButton = "panic-button",
    NearbyExposureRadius = "nearby-exposure-radius",
    ExposureRadiusOffset = "exposure-radius-offset",
}

const advancedSettingsDefaults = {};
advancedSettingsDefaults[AdvancedSetting.PanicButton] = false;
advancedSettingsDefaults[AdvancedSetting.NearbyExposureRadius] = 100;
advancedSettingsDefaults[AdvancedSetting.ExposureRadiusOffset] = 15;

export interface AdvancedSettings {
    getBoolean(setting: AdvancedSetting): boolean;
    getNumber(setting: AdvancedSetting): number;
    setBoolean(setting: AdvancedSetting, value: boolean): Promise<void>;
    setNumber(setting: AdvancedSetting, value: number): Promise<void>;
    reset(): Promise<void>;
}

class LocalAdvancedSettings implements AdvancedSettings {
    getBoolean(setting: AdvancedSetting): boolean {
        return ApplicationSettings.getBoolean(
            advancedSettingKey(setting),
            advancedSettingsDefaults[setting]
        );
    }

    getNumber(setting: AdvancedSetting): number {
        return ApplicationSettings.getNumber(
            advancedSettingKey(setting),
            advancedSettingsDefaults[setting]
        );
    }

    async setBoolean(setting: AdvancedSetting, value: boolean): Promise<void> {
        ApplicationSettings.setBoolean(advancedSettingKey(setting), value);
    }

    async setNumber(setting: AdvancedSetting, value: number): Promise<void> {
        ApplicationSettings.setNumber(advancedSettingKey(setting), value);
    }

    async reset(): Promise<void> {
        for (const setting of Object.keys(advancedSettingsDefaults)) {
            ApplicationSettings.remove(
                advancedSettingKey(setting as AdvancedSetting)
            );
        }
    }
}

export const advancedSettings: AdvancedSettings = new LocalAdvancedSettings();

function advancedSettingKey(setting: AdvancedSetting): string {
    return `${ADVANCED_SETTINGS_PREFIX}${setting}`;
}
