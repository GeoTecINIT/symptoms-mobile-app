import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { WelcomeRoutingModule } from "./welcome-routing.module";

import { LoginComponent } from "./login/login.component";

@NgModule({
    declarations: [LoginComponent],
    imports: [NativeScriptCommonModule, WelcomeRoutingModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WelcomeModule {}
