import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptCommonModule } from "@nativescript/angular";
import { WelcomeRoutingModule } from "./welcome-routing.module";
import { CommonComponentsModule } from "~/app/views/common/common-components.module";
import { AppSettingsOptionsModule } from "~/app/views/common/app-settings-options/app-settings-options.module";

import { LoginComponent } from "./login/login.component";
import { CodeFieldComponent } from "./login/code-field/code-field.component";

import { TutorialComponent } from "./tutorial/tutorial.component";
import { TutorialParagraphComponent } from "./tutorial/tutorial-paragraph/tutorial-paragraph.component";

import { SetupConfirmationComponent } from "./setup-confirmation/setup-confirmation.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        WelcomeRoutingModule,
        CommonComponentsModule,
        AppSettingsOptionsModule,
    ],
    declarations: [
        LoginComponent,
        CodeFieldComponent,
        TutorialComponent,
        TutorialParagraphComponent,
        SetupConfirmationComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
export class WelcomeModule {}
