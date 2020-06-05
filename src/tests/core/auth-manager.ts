import { authManager } from "~/app/core/auth/auth-manager";

describe("Auth manager", () => {
    it("returns current session data", async () => {
        const sessionData = await authManager.sessionData();
        expect(sessionData.id.length).toBeGreaterThan(0);
        expect(
            sessionData.isNew === true || sessionData.isNew === false
        ).toBeTruthy();
        expect(sessionData.createdAt.getTime()).toBeLessThan(
            new Date().getTime()
        );
        expect(sessionData.lastLogin.getTime()).toBeLessThan(
            new Date().getTime()
        );
    });
});
