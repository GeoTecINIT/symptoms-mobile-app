import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { MainRoutingModule } from "./main-routing.module";

import { MainComponent } from "./main.component";
import { MainActionBarComponent } from "./common/main-action-bar/main-action-bar.component";

import { CommonComponentsModule } from "../common/common-components.module";

import { NativeScriptMaterialBottomNavigationBarModule } from "@nativescript-community/ui-material-bottomnavigationbar/angular";
import { ContentModule } from "./pages/content/content.module";
import { NotificationsModule } from "./pages/notifications/notifications.module";
import { PlacesModule } from "./pages/places/places.module";
import { ProgressModule } from "./pages/progress/progress.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MainRoutingModule,
        CommonComponentsModule,
        NativeScriptMaterialBottomNavigationBarModule,
        ProgressModule,
        PlacesModule,
        ContentModule,
        NotificationsModule,
    ],
    declarations: [MainComponent, MainActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MainModule {}
