import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { MainRoutingModule } from "./main-routing.module";

import { MainComponent } from "./main.component";

import { CommonMainModule } from "./common/common-main.module";
import { NativeScriptMaterialBottomNavigationBarModule } from "nativescript-material-bottomnavigationbar/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MainRoutingModule,
        CommonMainModule,
        NativeScriptMaterialBottomNavigationBarModule,
    ],
    declarations: [MainComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MainModule {}
