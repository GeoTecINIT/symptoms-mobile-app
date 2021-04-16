import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { BootGuard } from "./views/boot.guard";
import { NativeScriptRouterModule } from "@nativescript/angular";

const routes: Routes = [
    {
        path: "",
        redirectTo: "main",
        pathMatch: "full",
    },

    {
        path: "welcome",
        loadChildren: () =>
            import("./views/welcome/welcome.module").then(
                (m) => m.WelcomeModule
            ),
    },
    {
        path: "main",
        canActivate: [BootGuard],
        loadChildren: () =>
            import("./views/main/main.module").then((m) => m.MainModule),
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
