import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { WelcomeRoutingModule } from "./welcome-routing.module";

@NgModule({
    declarations: [],
    imports: [NativeScriptCommonModule, WelcomeRoutingModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WelcomeModule {}
