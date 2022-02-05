import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { PanicButtonRoutingModule } from "./panic-button-routing.module";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { ContentDeliveryComponent } from "./pages/content-delivery/content-delivery.component";
import { MakeContactComponent } from "./pages/make-contact/make-contact.component";
import { PanicButtonContentComponent } from "./common/panic-button-content/panic-button-content.component";

@NgModule({
    declarations: [
        ContentDeliveryComponent,
        MakeContactComponent,
        PanicButtonContentComponent,
    ],
    imports: [
        PanicButtonRoutingModule,
        NativeScriptCommonModule,
        CommonComponentsModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class PanicButtonModule {}
