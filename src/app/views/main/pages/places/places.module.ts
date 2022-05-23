import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import {
    NativeScriptCommonModule,
    registerElement,
} from "@nativescript/angular";
import { PlacesContainerComponent } from "./places-container.component";
import { PlacesMapComponent } from "./places-map/places-map.component";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { NativeScriptMaterialActivityIndicatorModule } from "@nativescript-community/ui-material-activityindicator/angular";
import { PlacesListComponent } from "./places-list/places-list.component";
import { PlacesListItemComponent } from "./places-list/places-list-item/places-list-item.component";

registerElement(
    "Mapbox",
    () => require("@nativescript-community/ui-mapbox").MapboxView
);

@NgModule({
    imports: [
        NativeScriptCommonModule,
        CommonComponentsModule,
        NativeScriptMaterialActivityIndicatorModule,
    ],
    declarations: [
        PlacesContainerComponent,
        PlacesMapComponent,
        PlacesListComponent,
        PlacesListItemComponent,
    ],
    exports: [PlacesContainerComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class PlacesModule {}
