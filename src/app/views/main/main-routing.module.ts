import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import {
    NSEmptyOutletComponent,
    NativeScriptRouterModule,
} from "@nativescript/angular";
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
                path: "places",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./pages/places/places.module").then(
                        (m) => m.PlacesModule
                    ),
                outlet: "placesTab",
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
                path: "notifications",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./pages/notifications/notifications.module").then(
                        (m) => m.NotificationsModule
                    ),
                outlet: "notificationsTab",
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
                path: "content-view",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/content-view/content-view.module").then(
                        (m) => m.ContentViewModule
                    ),
                outlet: "contentViewModal",
            },
            {
                path: "confirm",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/confirm/confirm.module").then(
                        (m) => m.ConfirmModule
                    ),
                outlet: "confirmModal",
            },
            {
                path: "questions",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/questions/questions.module").then(
                        (m) => m.QuestionsModule
                    ),
                outlet: "questionsModal",
            },
            {
                path: "feedback",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/feedback/feedback.module").then(
                        (m) => m.FeedbackModule
                    ),
                outlet: "feedbackModal",
            },
            {
                path: "simulation",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/simulation/simulation.module").then(
                        (m) => m.SimulationModule
                    ),
                outlet: "simulationModal",
            },
        ],
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule {}
