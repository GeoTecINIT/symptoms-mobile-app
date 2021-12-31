import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { ContentRoutingModule } from "./content-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { NativeScriptMaterialTabsModule } from "@nativescript-community/ui-material-tabs/angular";

import { CommonMainModule } from "../../common/common-main.module";
import { ContentContainerComponent } from "./content-container.component";
import { ContentListComponent } from "./content-list/content-list.component";
import { ContentListItemComponent } from "./content-list/content-list-item/content-list-item.component";

@NgModule({
    imports: [
        ContentRoutingModule,
        NativeScriptCommonModule,
        NativeScriptMaterialTabsModule,
        CommonMainModule,
    ],
    declarations: [
        ContentContainerComponent,
        ContentListComponent,
        ContentListItemComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentModule {}
