import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ContentRoutingModule } from "./content-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { CommonMainModule } from "../../common/common-main.module";

import { ContentListComponent } from "./content-list.component";

@NgModule({
    declarations: [ContentListComponent],
    imports: [ContentRoutingModule, NativeScriptCommonModule, CommonMainModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentModule {}
