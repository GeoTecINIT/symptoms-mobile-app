import { firebaseAuthManager } from "~/app/core/auth/firebase-auth-manager";

describe("Auth manager", () => {
    if (1 === 1) {
        return;
    } // Skip test

    it("returns current session data", async () => {
        const sessionData = await firebaseAuthManager.sessionData();
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
