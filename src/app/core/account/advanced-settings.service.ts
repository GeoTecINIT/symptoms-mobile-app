import { Injectable } from "@angular/core";
import {
    AdvancedSetting,
    advancedSettings,
    AdvancedSettings,
} from "~/app/core/account/advanced-settings";

@Injectable({
    providedIn: "root",
})
export class AdvancedSettingsService implements AdvancedSettings {
    getBoolean(setting: AdvancedSetting): boolean {
        return advancedSettings.getBoolean(setting);
    }

    getNumber(setting: AdvancedSetting): number {
        return advancedSettings.getNumber(setting);
    }

    setBoolean(setting: AdvancedSetting, value: boolean): Promise<void> {
        return advancedSettings.setBoolean(setting, value);
    }

    setNumber(setting: AdvancedSetting, value: number): Promise<void> {
        return advancedSettings.setNumber(setting, value);
    }

    reset(): Promise<void> {
        return advancedSettings.reset();
    }
}
