import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { PanicButtonModalComponent } from "./panic-button-modal.component";
import { MakeContactComponent } from "./make-contact/make-contact.component";

const routes: Routes = [
    { path: "", component: PanicButtonModalComponent },
    { path: "make-contact", component: MakeContactComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
})
export class PanicButtonRoutingModule {}
