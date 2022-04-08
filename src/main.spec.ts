import "./polyfills";
import "zone.js/dist/zone-testing";

import { TestBed } from "@angular/core/testing";
import { NativeScriptTestingModule } from "@nativescript/angular/testing";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(
    NativeScriptTestingModule,
    platformBrowserDynamicTesting(),
    { teardown: { destroyAfterEach: true } }
);
