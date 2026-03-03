import { Component, OnInit } from "@angular/core";

@Component({
    selector: "SymApp",
    templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
        console.log("=== APP COMPONENT CONSTRUCTOR ===");
    }

    ngOnInit(): void {
        // Use dependencies here
        console.log("=== APP COMPONENT NG ON INIT ===");
    }
}
