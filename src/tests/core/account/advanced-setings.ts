import {
    AdvancedSetting,
    advancedSettings,
} from "~/app/core/account/advanced-settings";

describe("Advanced settings", () => {
    it("Returns default values", async () => {
        expect(
            await advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeFalse();
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.NearbyExposureRadius
            )
        ).toBe(100);
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.ExposureRadiusOffset
            )
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
            await advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeTrue();
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.NearbyExposureRadius
            )
        ).toBe(200);
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.ExposureRadiusOffset
            )
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
            await advancedSettings.getBoolean(AdvancedSetting.PanicButton)
        ).toBeFalse();
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.NearbyExposureRadius
            )
        ).toBe(100);
        expect(
            await advancedSettings.getNumber(
                AdvancedSetting.ExposureRadiusOffset
            )
        ).toBe(15);
    });

    afterEach(() => advancedSettings.reset());
});
