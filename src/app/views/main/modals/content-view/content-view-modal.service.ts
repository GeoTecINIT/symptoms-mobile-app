import { Injectable } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";

import { emitPatientReadContentAcquiredEvent } from "~/app/core/framework/events";
import { UserReadContent } from "@awarns/notifications";
import { filter, firstValueFrom, Subject, map, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ContentViewModalService {
    private seenEvents = new Subject<ContentSeenEvt>();

    constructor(private navigationService: NavigationService) {}

    showContent(id: string, notificationId?: number): Promise<boolean> {
        this.navigationService.navigate(["/main/content-view", id], {
            transition: "fade",
            duration: 200,
        });

        return firstValueFrom(
            this.seenEvents.pipe(
                filter((evt) => evt.id === id),
                map((evt) => evt.completely),
                tap((seenDuringSession) => {
                    emitPatientReadContentAcquiredEvent(
                        new UserReadContent(
                            id,
                            seenDuringSession,
                            notificationId
                        )
                    );
                })
            )
        );
    }

    contentWasSeen(id: string, completely: boolean) {
        this.seenEvents.next({ id, completely });
    }
}

interface ContentSeenEvt {
    id: string;
    completely: boolean;
}
