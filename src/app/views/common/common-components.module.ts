import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { CloseActionBarComponent } from "./close-action-bar/close-action-bar.component";
import { BackActionBarComponent } from "./back-action-bar/back-action-bar.component";
import { SlideNavigationButtonComponent } from "./slide-navigation-button/slide-navigation-button.component";
import { BasicActionBarComponent } from "./basic-action-bar/basic-action-bar.component";

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [
        CloseActionBarComponent,
        BackActionBarComponent,
        SlideNavigationButtonComponent,
        BasicActionBarComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [
        CloseActionBarComponent,
        BackActionBarComponent,
        SlideNavigationButtonComponent,
        BasicActionBarComponent,
    ],
})
export class CommonComponentsModule {}
