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
                path: "panic-button",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("./modals/panic-button/panic-button.module").then(
                        (m) => m.PanicButtonModule
                    ),
                outlet: "panicButtonModal",
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
    {
        path: "progress-detail",
        loadChildren: () =>
            import("./pages/progress/pages/progress-pages.module").then(
                (m) => m.ProgressPagesModule
            ),
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class MainRoutingModule {}
