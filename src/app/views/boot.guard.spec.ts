import { TestBed, inject } from "@angular/core/testing";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { BootGuard } from "./boot.guard";

describe("BootGuard", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NativeScriptModule],
            providers: [BootGuard],
        });
    });

    it("should ...", inject([BootGuard], (guard: BootGuard) => {
        expect(guard).toBeTruthy();
    }));
});
