import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule,
} from "@nativescript/angular";

import { PanicButtonModalComponent } from "./panic-button/panic-button-modal.component";

const MODAL_COMPONENTS = [PanicButtonModalComponent];

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [...MODAL_COMPONENTS],
    entryComponents: [...MODAL_COMPONENTS],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ModalsModule {}
