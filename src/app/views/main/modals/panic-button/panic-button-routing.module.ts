import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { ContentDeliveryComponent } from "./pages/content-delivery/content-delivery.component";
import { MakeContactComponent } from "./pages/make-contact/make-contact.component";

const routes: Routes = [
    { path: "", component: ContentDeliveryComponent },
    { path: "make-contact", component: MakeContactComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class PanicButtonRoutingModule {}
