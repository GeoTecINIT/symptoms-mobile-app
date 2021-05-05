import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { MainRoutingModule } from "./main-routing.module";

import { MainComponent } from "./main.component";

import { CommonComponentsModule } from "../common/common-components.module";
import { CommonMainModule } from "./common/common-main.module";
import { NativeScriptMaterialBottomNavigationBarModule } from "@nativescript-community/ui-material-bottomnavigationbar/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MainRoutingModule,
        CommonComponentsModule,
        CommonMainModule,
        NativeScriptMaterialBottomNavigationBarModule,
    ],
    declarations: [MainComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MainModule {}
