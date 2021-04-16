import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { LoginComponent } from "./login/login.component";
import { TutorialComponent } from "./tutorial/tutorial.component";
import { SetupConfirmationComponent } from "./setup-confirmation/setup-confirmation.component";

const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "tutorial", component: TutorialComponent },
    { path: "setup-confirmation", component: SetupConfirmationComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class WelcomeRoutingModule {}
