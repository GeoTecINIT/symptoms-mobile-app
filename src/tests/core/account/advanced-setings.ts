import {
    AdvancedSetting,
    advancedSettings,
} from "~/app/core/account/advanced-settings";

describe("Advanced settings", () => {
    beforeAll(() => advancedSettings.reset());

    it("Returns default values", async () => {
        expect(
            advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeFalse();
        expect(
            advancedSettings.getNumber(AdvancedSetting.NearbyExposureRadius)
        ).toBe(100);
        expect(
            advancedSettings.getNumber(AdvancedSetting.ExposureRadiusOffset)
        ).toBe(15);
    });

    it("Allows to update default values", async () => {
        await advancedSettings.setBoolean(AdvancedSetting.PanicButton, true);
        await advancedSettings.setNumber(
            AdvancedSetting.NearbyExposureRadius,
            200
        );
        await advancedSettings.setNumber(
            AdvancedSetting.ExposureRadiusOffset,
            20
        );

        expect(
            advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeTrue();
        expect(
            advancedSettings.getNumber(AdvancedSetting.NearbyExposureRadius)
        ).toBe(200);
        expect(
            advancedSettings.getNumber(AdvancedSetting.ExposureRadiusOffset)
        ).toBe(20);
    });

    it("Allows to reset updated settings to default values", async () => {
        await advancedSettings.setBoolean(AdvancedSetting.PanicButton, true);
        await advancedSettings.setNumber(
            AdvancedSetting.NearbyExposureRadius,
            200
        );
        await advancedSettings.setNumber(
            AdvancedSetting.ExposureRadiusOffset,
            20
        );

        await advancedSettings.reset();

        expect(
            advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeFalse();
        expect(
            advancedSettings.getNumber(AdvancedSetting.NearbyExposureRadius)
        ).toBe(100);
        expect(
            advancedSettings.getNumber(AdvancedSetting.ExposureRadiusOffset)
        ).toBe(15);
    });

    afterEach(() => advancedSettings.reset());
});
