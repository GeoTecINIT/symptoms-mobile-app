import { TestBed } from "@angular/core/testing";

import { AppSettingsService } from "~/app/views/app-settings.service";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

describe("AppSettingsService", () => {
    let service: AppSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NativeScriptModule] });
        service = TestBed.get(AppSettingsService);
    });

    it("returns the app version code in x.x.x format", () => {
        const versionSegments = service.version.split(".");
        expect(versionSegments.length).toEqual(3);
        for (const segment of versionSegments) {
            expect(parseInt(segment, 10)).toEqual(jasmine.any(Number));
        }
    });

    it("allows to set a data sharing policy and persist the decision", async () => {
        await service.setDataSharingConsent(true);
        const consents = await service.getDataSharingConsent();
        expect(consents).toBeTruthy();
    });
});
