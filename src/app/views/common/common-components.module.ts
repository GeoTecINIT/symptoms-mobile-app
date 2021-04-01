import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { CloseActionBarComponent } from "./close-action-bar/close-action-bar.component";
import { BackActionBarComponent } from "./back-action-bar/back-action-bar.component";

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [CloseActionBarComponent, BackActionBarComponent],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [CloseActionBarComponent, BackActionBarComponent],
})
export class CommonComponentsModule {}
