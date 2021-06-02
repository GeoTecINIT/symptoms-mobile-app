import { TestBed } from "@angular/core/testing";
import { NativeScriptModule } from "@nativescript/angular";

import { PatientDataService } from "~/app/views/patient-data.service";

describe("PatientDataService", () => {
    let service: PatientDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NativeScriptModule] });
        service = TestBed.inject(PatientDataService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
