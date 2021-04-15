import { TestBed } from "@angular/core/testing";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AuthService } from "~/app/views/auth.service";

describe("AuthService", () => {
    beforeEach(() =>
        TestBed.configureTestingModule({ imports: [NativeScriptModule] })
    );

    it("should be created", () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });
});
