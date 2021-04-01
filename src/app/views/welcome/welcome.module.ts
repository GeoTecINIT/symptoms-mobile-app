import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { WelcomeRoutingModule } from "./welcome-routing.module";

import { CommonComponentsModule } from "~/app/views/common/common-components.module";

import { LoginComponent } from "./login/login.component";
import { TutorialComponent } from "./tutorial/tutorial.component";
import { SetupConfirmationComponent } from "./setup-confirmation/setup-confirmation.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        WelcomeRoutingModule,
        CommonComponentsModule,
    ],
    declarations: [
        LoginComponent,
        TutorialComponent,
        SetupConfirmationComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WelcomeModule {}
