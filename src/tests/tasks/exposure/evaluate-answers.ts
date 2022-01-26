import { Exposure } from "~/app/core/persistence/exposures";
import { EvaluateExposureAnswers } from "~/app/tasks/exposure/evaluate-answers";
import {
    createFakeAoI,
    createNewFakeExposure,
} from "~/tests/tasks/exposure/index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { Task } from "@geotecinit/emai-framework/tasks";
import {
    EventData,
    TaskDispatcherEvent,
} from "@geotecinit/emai-framework/events";

describe("Evaluate exposure answers task", () => {
    let task: EvaluateExposureAnswers;

    beforeEach(() => {
        task = new EvaluateExposureAnswers();
    });

    it("does nothing when the exposure has not yet started", async () => {
        const ongoingExposure = crateFakeExposure([6], false);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            TaskDispatcherEvent.TaskChainFinished
        );
    });

    it("does nothing when the exposure has already finished", async () => {
        const finishedExposure = crateFakeExposure([6], false);
        finishedExposure.endTime = new Date();

        await invokeWithDataAndWaitUntilDone(
            task,
            finishedExposure,
            TaskDispatcherEvent.TaskChainFinished
        );
    });

    it("reports an initial low sustained anxiety level when first three values are at 3 or below", async () => {
        const ongoingExposure = crateFakeExposure([3, 2, 3]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientShowsAnInitialSustainedLowAnxietyLevel"
        );
    });

    it("reports a high sustained anxiety level when under exposure and last value is a 10", async () => {
        const ongoingExposure = crateFakeExposure([8, 10]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientShowsAHighAnxietyLevel"
        );
    });

    it("reports a high sustained anxiety level when under exposure and last 2 values are 9s", async () => {
        const ongoingExposure = crateFakeExposure([9, 9]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientShowsAHighAnxietyLevel"
        );
    });

    it("reports a high sustained anxiety level when under exposure and last 3 values are 8 or more", async () => {
        const ongoingExposure = crateFakeExposure([9, 8, 7, 8, 9, 8]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientShowsAHighAnxietyLevel"
        );
    });

    it("reports that patient keeps on a high anxiety level strike when it is the case", async () => {
        const ongoingExposure = crateFakeExposure([9, 9, 8, 9]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientUnderAHighAnxietyLevelStrike"
        );
    });

    it("reports nothing when the patient has overcome the strike", async () => {
        const ongoingExposure = crateFakeExposure([9, 9, 8, 9, 7]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "exposureAnswersEvaluated"
        );
    });

    it("reports that patient high anxiety values have returned after recovery", async () => {
        const ongoingExposure = crateFakeExposure([9, 9, 8, 9, 7, 9, 9]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientShowsAHighAnxietyLevel"
        );
    });

    it("reports that patient could get some reward when none of the above apply, and every 2 reports", async () => {
        const ongoingExposure = crateFakeExposure([9, 8, 7, 8, 7, 8]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "patientCouldGetSomeReward"
        );
    });

    it("does nothing otherwise", async () => {
        const ongoingExposure = crateFakeExposure([9, 8, 7, 8, 7, 8, 6]);

        await invokeWithDataAndWaitUntilDone(
            task,
            ongoingExposure,
            "exposureAnswersEvaluated"
        );
    });
});

function crateFakeExposure(
    emotionValues: Array<number>,
    started = true
): Exposure {
    return createNewFakeExposure(createFakeAoI("AoI1"), started, emotionValues);
}

async function invokeWithDataAndWaitUntilDone(
    task: Task,
    data: EventData,
    listenTo: string
): Promise<void> {
    const invocationEvent = createEvent("eventTrigger", { data });

    const done = listenToEventTrigger(listenTo, invocationEvent.id);

    task.run({}, invocationEvent);

    await done;
}
