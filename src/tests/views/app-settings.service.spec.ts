import { TestBed } from "@angular/core/testing";

import { NativeScriptModule } from "@nativescript/angular";

import { AppSettingsService } from "~/app/views/app-settings.service";

describe("AppSettingsService", () => {
    let service: AppSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NativeScriptModule] });
        service = TestBed.inject(AppSettingsService);
    });

    it("returns the app version code in x.x.x format", () => {
        const versionSegments = service.version.split(".");
        expect(versionSegments.length).toEqual(3);
        for (const segment of versionSegments) {
            expect(parseInt(segment, 10)).toEqual(jasmine.any(Number));
        }
    });
});
