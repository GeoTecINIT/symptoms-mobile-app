import { Provider } from "~/app/core/providers/provider";
import { PlatformType } from "~/app/core/providers/record-type";

export function createProviderMock(): Provider {
    return {
        provides: PlatformType.Geolocation,
        next() {
            return [Promise.resolve(null), null];
        },
        checkIfIsReady() {
            return Promise.resolve(null);
        },
        prepare() {
            return Promise.resolve();
        },
    };
}
