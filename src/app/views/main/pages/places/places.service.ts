import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import {
    AreaOfInterest,
    areasOfInterest,
    onAoIListUpdated,
} from "~/app/core/framework/aois";
import { getLogger, Logger } from "~/app/core/utils/logger";

@Injectable({
    providedIn: "root",
})
export class PlacesService {
    get aois$(): Observable<Array<AreaOfInterest>> {
        return this.aois.asObservable();
    }

    private aois = new ReplaySubject<Array<AreaOfInterest>>(
        1 /* Just keep last AoIs list*/
    );
    private logger: Logger;

    constructor() {
        this.logger = getLogger("PlacesService");

        this.updateAoIsList();
        onAoIListUpdated(() => this.updateAoIsList());
    }

    private updateAoIsList() {
        areasOfInterest
            .getAll()
            .then((aois) => this.aois.next(aois))
            .catch((err) =>
                this.logger.error(
                    `Could not retrieve list of AoIs. Reason: ${err}`
                )
            );
    }
}
