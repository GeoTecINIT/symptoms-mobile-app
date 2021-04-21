import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ContentRoutingModule } from "./content-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { CommonMainModule } from "../../common/common-main.module";

import { ContentListComponent } from "./content-list.component";
import { ContentListItemComponent } from "./content-list-item/content-list-item.component";

@NgModule({
    imports: [ContentRoutingModule, NativeScriptCommonModule, CommonMainModule],
    declarations: [ContentListComponent, ContentListItemComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentModule {}
