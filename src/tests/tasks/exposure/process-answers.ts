import { Exposure, ExposuresStore } from "~/app/core/persistence/exposures";
import { ProcessExposureAnswers } from "~/app/tasks/exposure/process-answers";
import {
    createExposuresStoreMock,
    createFakeAoI,
} from "~/tests/tasks/exposure/index";
import {
    createEvent,
    listenToEventTrigger,
} from "@geotecinit/emai-framework/testing/events";
import { QuestionnaireAnswers } from "@geotecinit/emai-framework/entities/answers";

describe("Process exposure answers task", () => {
    let storeMock: ExposuresStore;
    let task: ProcessExposureAnswers;

    const ongoingExposure = {
        id: "exposure-1",
        startTime: new Date(Date.now() - 60 * 60 * 1000 /* 1h ago */),
        place: createFakeAoI("AoI1"),
        emotionValues: [],
        successful: false,
    };

    beforeEach(() => {
        storeMock = createExposuresStoreMock();
        task = new ProcessExposureAnswers(storeMock);
        spyOn(storeMock, "update");
    });

    it("updates an ongoing exposure with the given questionnaire answers", async () => {
        spyOn(storeMock, "getLastUnfinished").and.returnValue(
            Promise.resolve(ongoingExposure)
        );

        const answers = new QuestionnaireAnswers("q1", [
            { title: "¿Anxiety level?", answer: 6, millisecondsToAnswer: 4000 },
        ]);
        const invocationEvent = createEvent("eventTrigger", { data: answers });

        const resultPromise = listenToEventTrigger(
            "exposureAnswersProcessed",
            invocationEvent.id
        );

        task.run({}, invocationEvent);

        const result = (await resultPromise) as Exposure;
        expect(storeMock.update).toHaveBeenCalled();
        expect(result).toEqual({
            ...ongoingExposure,
            emotionValues: [
                {
                    value: answers.answers[0].answer as number,
                    timestamp: answers.timestamp,
                },
            ],
        });
    });
});
