import { createProviderMock } from "../../providers";
import { ProviderTask } from "~/app/core/tasks/base/provider-task";
import { PlatformType, RecordType } from "~/app/core/providers/record-type";
import { DispatchableEvent } from "nativescript-task-dispatcher/events";
import { createEvent, on } from "nativescript-task-dispatcher/internal/events";

describe("Provider task", () => {
    const provider = createProviderMock();

    const providerTask = new ProviderTask("dummyTask", provider);

    const taskParams = {};
    let invocationEvent: DispatchableEvent;

    const expectedRecordType = new RecordType(PlatformType.Geolocation);
    let expectedRecordEvent: DispatchableEvent;

    const expectedError = new Error("Provider not ready!");

    beforeEach(() => {
        invocationEvent = createEvent("dummyEvent");
        expectedRecordEvent = createEvent(
            `${expectedRecordType.type}Acquired`,
            { id: invocationEvent.id, data: { record: expectedRecordType } }
        );
    });

    it("obtains provider next value and emits that value", async () => {
        const eventSpy = jasmine.createSpy();
        spyOn(provider, "next").and.returnValue([
            Promise.resolve(expectedRecordType),
            () => null,
        ]);
        on(expectedRecordEvent.name, eventSpy);
        await providerTask.run(taskParams, invocationEvent);

        expect(eventSpy).toHaveBeenCalledWith(expectedRecordEvent);
    });

    it("cancels the request for the next value when needed", async () => {
        const providerInterruptor = jasmine.createSpy();
        const nextValuePromise: Promise<RecordType> = new Promise((resolve) => {
            setTimeout(() => {
                resolve(expectedRecordType);
            }, 2000);
        });
        spyOn(provider, "next").and.returnValue([
            nextValuePromise,
            providerInterruptor,
        ]);

        const runPromise = providerTask.run(taskParams, invocationEvent);
        providerTask.cancel();

        await runPromise;

        expect(providerInterruptor).toHaveBeenCalled();
    });

    it("propagates an error when some provider condition is not satisfied", async () => {
        spyOn(provider, "checkIfIsReady").and.returnValue(
            Promise.reject(expectedError)
        );

        await expectAsync(
            providerTask.run(taskParams, invocationEvent)
        ).toBeRejectedWith(expectedError);
    });

    it("propagates an error when something goes wrong on the provider", async () => {
        spyOn(provider, "next").and.throwError("Something go wrong");

        await expectAsync(
            providerTask.run(taskParams, invocationEvent)
        ).toBeRejectedWith(new Error("Something go wrong"));
    });
});
