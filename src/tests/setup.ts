import "@nativescript/zone-js";
import "zone.js/dist/zone-testing";

import { TestBed } from "@angular/core/testing";
import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

export function customNsTestBedInit(): void {
    TestBed.initTestEnvironment(
        BrowserTestingModule,
        platformBrowserDynamicTesting()
    );
}
customNsTestBedInit();
