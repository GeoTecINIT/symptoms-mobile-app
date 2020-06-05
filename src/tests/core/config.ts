import { getConfig, setEnvironment, Environment } from "~/app/core/config";

describe("Config", () => {
    it("returns development environment by default", () => {
        const conf = getConfig();
        expect(conf.production).toBeFalsy();
    });

    it("changes environment when required", () => {
        setEnvironment("production");
        const conf = getConfig();
        expect(conf.production).toBeTruthy();
    });

    afterEach(() => {
        setEnvironment("development");
    });
});
