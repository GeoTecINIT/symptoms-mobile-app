import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptAnimationsModule,
    NativeScriptModule,
} from "@nativescript/angular";
import { NativeScriptLocalizeModule } from "@nativescript/localize/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ModalsModule } from "./views/main/modals/modals.module";

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptAnimationsModule,
        NativeScriptLocalizeModule,
        AppRoutingModule,
        ModalsModule,
    ],
    declarations: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
