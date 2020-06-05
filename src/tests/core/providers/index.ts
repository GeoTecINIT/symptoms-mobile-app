import { Provider } from "~/app/core/providers/provider";

export function createProviderMock(): Provider {
    return {
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
