import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { MainRoutingModule } from "./main-routing.module";

import { MainComponent } from "./main.component";

import { CommonMainModule } from "./common/common-main.module";

@NgModule({
    declarations: [MainComponent],
    imports: [NativeScriptCommonModule, MainRoutingModule, CommonMainModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MainModule {}
