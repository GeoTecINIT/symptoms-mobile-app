import {
    DispatchableEvent,
    Task,
    TaskOutcome,
    TaskParams,
} from "@awarns/core/tasks";
import { EmotionValue, Exposure } from "~/app/core/persistence/exposures";

const TASK_NAME = "evaluateExposureAnswers";
const EXPOSURE_ANSWERS_EVALUATED = "exposureAnswersEvaluated";
const PATIENT_SHOWS_AN_INITIAL_SUSTAINED_LOW_ANXIETY_LEVEL =
    "patientShowsAnInitialSustainedLowAnxietyLevel";
const PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL = "patientShowsAHighAnxietyLevel";
const PATIENT_UNDER_A_HIGH_ANXIETY_LEVEL_STRIKE =
    "patientUnderAHighAnxietyLevelStrike";
const PATIENT_COULD_GET_SOME_REWARD = "patientCouldGetSomeReward";
const PATIENT_COULD_GET_A_BOOSTER = "patientCouldGetABooster";

const LOW_ANXIETY_THRESHOLD = 3;
const HIGH_ANXIETY_THRESHOLD = 8;
const VERY_HIGH_ANXIETY_THRESHOLD = 9;
const EXTREME_ANXIETY_THRESHOLD = 10;

export class EvaluateExposureAnswers extends Task {
    constructor() {
        super(TASK_NAME, {
            outputEventNames: [
                EXPOSURE_ANSWERS_EVALUATED,
                PATIENT_SHOWS_AN_INITIAL_SUSTAINED_LOW_ANXIETY_LEVEL,
                PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL,
                PATIENT_UNDER_A_HIGH_ANXIETY_LEVEL_STRIKE,
                PATIENT_COULD_GET_SOME_REWARD,
                PATIENT_COULD_GET_A_BOOSTER,
            ],
        });
    }

    protected async onRun(
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
        if (emotionValues.length === 0) {
            throw new Error("Cannot evaluate answers when there are none!");
        }

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
            if (previousValuesShowSignsOfHighAnxiety(emotionValues)) {
                return {
                    eventName: PATIENT_UNDER_A_HIGH_ANXIETY_LEVEL_STRIKE,
                };
            } else {
                return {
                    eventName: PATIENT_SHOWS_A_HIGH_ANXIETY_LEVEL,
                };
            }
        }

        if (valuesNumberIsEven(emotionValues)) {
            if (getLastValue(emotionValues) < 8) {
                return { eventName: PATIENT_COULD_GET_SOME_REWARD };
            } else {
                return { eventName: PATIENT_COULD_GET_A_BOOSTER };
            }
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

function previousValuesShowSignsOfHighAnxiety(
    emotionValues: Array<EmotionValue>
) {
    return lastValuesShowSignsOfHighAnxiety(emotionValues.slice(0, -1));
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

function getLastValue(emotionValues: Array<EmotionValue>): number {
    return emotionValues[emotionValues.length - 1].value;
}
