import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NSEmptyOutletComponent } from "nativescript-angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MainComponent } from "~/app/views/main/main.component";

const routes: Routes = [
    {
        path: "default",
        component: MainComponent,
        children: [
            {
                path: "progress",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./progress/progress.module").then(
                        (m) => m.ProgressModule
                    ),
                outlet: "progressTab",
            },
            {
                path: "content",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./content/content.module").then(
                        (m) => m.ContentModule
                    ),
                outlet: "contentTab",
            },
            {
                path: "simulation",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./simulation/simulation.module").then(
                        (m) => m.SimulationModule
                    ),
                outlet: "simulationTab",
            },
            {
                path: "settings",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./settings/settings.module").then(
                        (m) => m.SettingsModule
                    ),
                outlet: "settingsModal",
            },
        ],
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule {}
