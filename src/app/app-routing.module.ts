import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NSEmptyOutletComponent } from "nativescript-angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    {
        path: "",
        redirectTo: "welcome",
        pathMatch: "full",
    },

    {
        path: "welcome",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("./views/welcome/welcome.module").then(
                (m) => m.WelcomeModule
            ),
    },
    {
        path: "main",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("./views/main/main.module").then((m) => m.MainModule),
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
