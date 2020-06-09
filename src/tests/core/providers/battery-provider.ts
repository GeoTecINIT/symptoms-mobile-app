import { BatteryProvider } from "~/app/core/providers/battery";
import { PlatformType } from "~/app/core/providers/record-type";

describe("Battery provider", () => {
    it("returns the current battery level", async () => {
        const level = await getBatteryLevel();
        expect(level.value).toBeGreaterThan(0);
        expect(level.value).toBeLessThanOrEqual(100);
        expect(level.type).toEqual(PlatformType.BatteryLevel);
    });

    it("returns battery level when SDK is 21 or above", async () => {
        const level = await getBatteryLevel(21);
        expect(level.value).toBeGreaterThan(0);
        expect(level.value).toBeLessThanOrEqual(100);
    });

    it("returns battery level when below SDK 21", async () => {
        const level = await getBatteryLevel(20);
        expect(level.value).toBeGreaterThan(0);
        expect(level.value).toBeLessThanOrEqual(100);
    });
});

function getBatteryLevel(sdkVersion?: number) {
    const provider = !sdkVersion
        ? new BatteryProvider()
        : new BatteryProvider(sdkVersion);
    const [levelPromise] = provider.next();

    return levelPromise;
}
