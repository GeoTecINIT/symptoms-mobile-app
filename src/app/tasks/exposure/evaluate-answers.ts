import {
    DispatchableEvent,
    TaskOutcome,
    TaskParams,
    TraceableTask,
} from "@geotecinit/emai-framework/tasks";
import { EmotionValue, Exposure } from "~/app/core/persistence/exposures";

const TASK_NAME = "evaluateExposureAnswers";
const EXPOSURE_ANSWERS_EVALUATED = "exposureAnswersEvaluated";
const PATIENT_SHOWS_AN_INITIAL_SUSTAINED_LOW_ANXIETY_LEVEL =
    "patientShowsAnInitialSustainedLowAnxietyLevel";
const PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL = "patientShowsAHighAnxietyLevel";
const PATIENT_COULD_GET_SOME_REWARD = "patientCouldGetSomeReward";

const LOW_ANXIETY_THRESHOLD = 3;
const HIGH_ANXIETY_THRESHOLD = 8;
const VERY_HIGH_ANXIETY_THRESHOLD = 9;
const EXTREME_ANXIETY_THRESHOLD = 10;

export class EvaluateExposureAnswers extends TraceableTask {
    constructor() {
        super(TASK_NAME, {
            outputEventNames: [
                EXPOSURE_ANSWERS_EVALUATED,
                PATIENT_SHOWS_AN_INITIAL_SUSTAINED_LOW_ANXIETY_LEVEL,
                PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL,
                PATIENT_COULD_GET_SOME_REWARD,
            ],
        });
    }

    protected async onTracedRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<TaskOutcome> {
        const ongoingExposure = invocationEvent.data as Exposure;
        if (!ongoingExposure.startTime) {
            throw new Error(
                "Cannot evaluate the answers of a non-started exposure!"
            );
        }
        if (ongoingExposure.endTime) {
            throw new Error(
                "Cannot evaluate the answers of a finished exposure!"
            );
        }

        const { emotionValues } = ongoingExposure;
        if (
            containsExactlyThreeValuesAndNoneIsAboveTheLowAnxietyThreshold(
                emotionValues
            )
        ) {
            return {
                eventName: PATIENT_SHOWS_AN_INITIAL_SUSTAINED_LOW_ANXIETY_LEVEL,
            };
        }
        if (lastValuesShowSignsOfHighAnxiety(emotionValues)) {
            return {
                eventName: PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL,
            };
        }

        if (valuesNumberIsEven(emotionValues)) {
            return { eventName: PATIENT_COULD_GET_SOME_REWARD };
        }

        return { eventName: EXPOSURE_ANSWERS_EVALUATED };
    }
}

function containsExactlyThreeValuesAndNoneIsAboveTheLowAnxietyThreshold(
    emotionValues: Array<EmotionValue>
): boolean {
    return (
        emotionValues.length === 3 &&
        emotionValues.every((item) => item.value <= LOW_ANXIETY_THRESHOLD)
    );
}

function lastValuesShowSignsOfHighAnxiety(
    emotionValues: Array<EmotionValue>
): boolean {
    return (
        containsAtLeastOneValueAndIsAboveTheExtremeAnxietyThreshold(
            emotionValues
        ) ||
        containsAtLeastTwoValuesAndAreAboveTheVeryHighAnxietyThreshold(
            emotionValues
        ) ||
        containsAtLeastThreeValuesAndAreAboveTheHighAnxietyThreshold(
            emotionValues
        )
    );
}

function containsAtLeastOneValueAndIsAboveTheExtremeAnxietyThreshold(
    emotionValues: Array<EmotionValue>
): boolean {
    return containsAMinimumSetOfValuesAndAllMeetTheThreshold(
        emotionValues,
        1,
        EXTREME_ANXIETY_THRESHOLD
    );
}

function containsAtLeastTwoValuesAndAreAboveTheVeryHighAnxietyThreshold(
    emotionValues: Array<EmotionValue>
) {
    return containsAMinimumSetOfValuesAndAllMeetTheThreshold(
        emotionValues,
        2,
        VERY_HIGH_ANXIETY_THRESHOLD
    );
}

function containsAtLeastThreeValuesAndAreAboveTheHighAnxietyThreshold(
    emotionValues: Array<EmotionValue>
): boolean {
    return containsAMinimumSetOfValuesAndAllMeetTheThreshold(
        emotionValues,
        3,
        HIGH_ANXIETY_THRESHOLD
    );
}

function containsAMinimumSetOfValuesAndAllMeetTheThreshold(
    emotionValues: Array<EmotionValue>,
    requiredSize: number,
    threshold: number
): boolean {
    if (emotionValues.length < requiredSize) {
        return false;
    }
    const lastValues = emotionValues.slice(emotionValues.length - requiredSize);

    return lastValues.every((item) => item.value >= threshold);
}

function valuesNumberIsEven(emotionValues: Array<EmotionValue>): boolean {
    return emotionValues.length % 2 === 0;
}