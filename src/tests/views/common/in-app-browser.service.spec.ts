import { TestBed } from "@angular/core/testing";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { InAppBrowserService } from "~/app/views/common/in-app-browser.service";

describe("InAppBrowserService", () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [NativeScriptModule, CommonComponentsModule],
        })
    );

    it("should be created", () => {
        const service: InAppBrowserService = TestBed.get(InAppBrowserService);
        expect(service).toBeTruthy();
    });
});
