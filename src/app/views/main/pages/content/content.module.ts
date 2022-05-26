import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";

import { ContentContainerComponent } from "./content-container.component";
import { ContentListComponent } from "./content-list/content-list.component";
import { ContentListItemComponent } from "./content-list/content-list-item/content-list-item.component";

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [
        ContentContainerComponent,
        ContentListComponent,
        ContentListItemComponent,
    ],
    exports: [ContentContainerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ContentModule {}
