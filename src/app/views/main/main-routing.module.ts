import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NSEmptyOutletComponent } from "nativescript-angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MainComponent } from "~/app/views/main/main.component";

const routes: Routes = [
    { path: "", redirectTo: "default", pathMatch: "full" },
    {
        path: "default",
        component: MainComponent,
        children: [
            {
                path: "progress",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./pages/progress/progress.module").then(
                        (m) => m.ProgressModule
                    ),
                outlet: "progressTab",
            },
            {
                path: "content",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./pages/content/content.module").then(
                        (m) => m.ContentModule
                    ),
                outlet: "contentTab",
            },
            {
                path: "simulation",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./pages/simulation/simulation.module").then(
                        (m) => m.SimulationModule
                    ),
                outlet: "simulationTab",
            },
            {
                path: "settings",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/settings/settings.module").then(
                        (m) => m.SettingsModule
                    ),
                outlet: "settingsModal",
            },
            {
                path: "notifications",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/notifications/notifications.module").then(
                        (m) => m.NotificationsModule
                    ),
                outlet: "notificationsModal",
            },
            {
                path: "content-view",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/content-view/content-view.module").then(
                        (m) => m.ContentViewModule
                    ),
                outlet: "contentViewModal",
            },
        ],
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule {}
