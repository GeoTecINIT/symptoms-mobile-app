import { Injectable } from "@angular/core";

import { NavigationService } from "~/app/views/navigation.service";
import { ConfirmModalOptions } from "~/app/core/modals/confirm";

import { filter, firstValueFrom, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { emitPatientConfirmationAcquiredEvent } from "~/app/core/framework/events";
import { UserConfirmation } from "@awarns/notifications";

@Injectable({
    providedIn: "root",
})
export class ConfirmModalService {
    private doneEvents = new Subject<DoneEvent>();

    constructor(private navigationService: NavigationService) {}

    show(
        confirmationId: string,
        options: ConfirmModalOptions,
        notificationId?: number
    ): Promise<boolean> {
        const instanceId = Date.now();

        this.navigationService.navigate(["/main/confirm", instanceId], {
            transition: "fade",
            duration: 200,
            state: options,
        });

        return firstValueFrom(
            this.doneEvents.pipe(
                filter((evt) => evt.instanceId === instanceId),
                map((evt) => evt.confirmed),
                tap((result) => {
                    if (result === undefined) return;
                    emitPatientConfirmationAcquiredEvent(
                        new UserConfirmation(
                            confirmationId,
                            options.question,
                            options.negative ? !result : result,
                            notificationId
                        )
                    );
                })
            )
        );
    }

    gotConfirmation(instanceId: number, confirmed?: boolean) {
        this.doneEvents.next({
            instanceId,
            confirmed,
        });
    }
}

interface DoneEvent {
    instanceId: number;
    confirmed?: boolean;
}
