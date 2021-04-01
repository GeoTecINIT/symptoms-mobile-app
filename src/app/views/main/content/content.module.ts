import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ContentRoutingModule } from "./content-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ContentListComponent } from "./content-list.component";
import { CommonMainModule } from "~/app/views/main/common/common-main.module";

@NgModule({
    declarations: [ContentListComponent],
    imports: [ContentRoutingModule, NativeScriptCommonModule, CommonMainModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentModule {}
