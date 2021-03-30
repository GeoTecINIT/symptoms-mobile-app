import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { MainRoutingModule } from "./main-routing.module";

@NgModule({
    declarations: [],
    imports: [NativeScriptCommonModule, MainRoutingModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MainModule {}
