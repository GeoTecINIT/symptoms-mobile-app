import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { PanicButtonRoutingModule } from "./panic-button-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { PanicButtonModalComponent } from "./panic-button-modal.component";
import { MakeContactComponent } from "./make-contact/make-contact.component";
import { PanicButtonContentComponent } from "./common/panic-button-content/panic-button-content.component";

@NgModule({
    imports: [
        PanicButtonRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    declarations: [
        PanicButtonModalComponent,
        MakeContactComponent,
        PanicButtonContentComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class PanicButtonModule {}
