import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule,
} from "@nativescript/angular";
import { NativeScriptMaterialActivityIndicatorModule } from "@nativescript-community/ui-material-activityindicator/angular";

import { CloseActionBarComponent } from "./close-action-bar/close-action-bar.component";
import { BackActionBarComponent } from "./back-action-bar/back-action-bar.component";
import { SlideNavigationButtonComponent } from "./slide-navigation-button/slide-navigation-button.component";
import { BasicActionBarComponent } from "./basic-action-bar/basic-action-bar.component";

import { ButtonLinkComponent } from "./button-link/button-link.component";
import { BaseButtonComponent } from "./base-button/base-button.component";
import { PrimaryButtonComponent } from "./primary-button/primary-button.component";
import { SecondaryButtonComponent } from "./secondary-button/secondary-button.component";
import { ConfirmButtonComponent } from "./confirm-button/confirm-button.component";

import { NumericSelectorComponent } from "./numeric-selector/numeric-selector.component";
import { StepProgressBarComponent } from "./step-progress-bar/step-progress-bar.component";
import { DangerButtonComponent } from "./danger-button/danger-button.component";
import { CircleIconComponent } from "./circle-icon/circle-icon.component";
import { ActivityIndicatorComponent } from "./activity-indicator/activity-indicator.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptMaterialActivityIndicatorModule,
    ],
    declarations: [
        CloseActionBarComponent,
        BackActionBarComponent,
        SlideNavigationButtonComponent,
        BasicActionBarComponent,
        ButtonLinkComponent,
        BaseButtonComponent,
        PrimaryButtonComponent,
        SecondaryButtonComponent,
        ConfirmButtonComponent,
        NumericSelectorComponent,
        StepProgressBarComponent,
        DangerButtonComponent,
        CircleIconComponent,
        ActivityIndicatorComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [
        CloseActionBarComponent,
        BackActionBarComponent,
        SlideNavigationButtonComponent,
        BasicActionBarComponent,
        ButtonLinkComponent,
        PrimaryButtonComponent,
        SecondaryButtonComponent,
        ConfirmButtonComponent,
        NumericSelectorComponent,
        StepProgressBarComponent,
        DangerButtonComponent,
        CircleIconComponent,
        ActivityIndicatorComponent,
    ],
})
export class CommonComponentsModule {}
