import {
    File,
} from "@nativescript/core/file-system";

import { Buffer } from "buffer";

import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { EventData } from "@awarns/core/events";

import { getLogger } from "~/app/core/utils/logger";
import {
    Exposure,
    exposures,
    ExposuresStore,
} from "~/app/core/persistence/exposures";

const AUDIOS_ENCODED_IN_FEEDBACK = "audiosEncodedInFeedback";
const AUDIOS_ENCODED_IN_QUESTIONNAIRE = "audiosEncodedInQuestionnaire";
const AUDIOS_ENCODED_IN_QUESTIONNAIRE_WITHOUT_PROCESSING = "audiosEncodedInQuestionnaireWithoutProcessing"; 

// This task takes the records from user-feedback and questionnaire-answers modals
// and encode the audios in base64 (if present). This task must be done before the 
// writeRecords task. 
export class EncodeAudioTask extends Task {
    constructor(private store: ExposuresStore = exposures) {
        super("encodeAudio", {
            // Different output names are needed because different tasks are executed after the audio encoding for feedback and questionnaires
            // There is a distinction in questionnaires. When an exposure is finished, some post-exposure questions are asked and, unlike exposure 
            // questions, these don't need to be processed (processExposureAnswers task).    
            outputEventNames: [
                AUDIOS_ENCODED_IN_FEEDBACK,
                AUDIOS_ENCODED_IN_QUESTIONNAIRE,
                AUDIOS_ENCODED_IN_QUESTIONNAIRE_WITHOUT_PROCESSING
            ]
        })
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const exposureId = 
            (await this.store.getLastUnfinished())?.id ?? 
            (await this.store.getLastFinished())?.id;

        if (!exposureId) return;

        let invocationEventData: EventData = { ...invocationEvent.data, exposureId };

        let eventName = AUDIOS_ENCODED_IN_FEEDBACK;
        switch (invocationEventData.type) {
            case "user-feedback":
                invocationEventData = this.replaceAudioPathInAnswers(invocationEventData);
                eventName = AUDIOS_ENCODED_IN_FEEDBACK;
                break;
            case "questionnaire-answers":
                invocationEventData = this.replaceAudioPathInQuestions(invocationEventData);
                eventName = invocationEventData.questionnaireId === "post-exposure-questions" 
                    ? AUDIOS_ENCODED_IN_QUESTIONNAIRE_WITHOUT_PROCESSING 
                    : AUDIOS_ENCODED_IN_QUESTIONNAIRE;
                break;
        }

        return { eventName: eventName, result: invocationEventData };
    }

    private replaceAudioPathInAnswers(invocationEventData: EventData) {
        invocationEventData.feedback = 
            invocationEventData.feedback.includes("/data/data") 
            ? this.encodeAudioFromFilePath(invocationEventData.feedback) 
            : invocationEventData.feedback; 
        return invocationEventData;
    }
    
    private replaceAudioPathInQuestions(invocationEventData: EventData) {
        invocationEventData.answers = invocationEventData.answers.map(a => 
            typeof a.answer === "string" && a.answer.includes("/data/data") 
            ? {...a, answer: this.encodeAudioFromFilePath(a.answer)} 
            : a)
        return invocationEventData;
    }

    private encodeAudioFromFilePath(audioFilePath: string): string {
        try {
            // Getting audio file
            const audioFile = File.fromPath(audioFilePath);

            // Encoding audio
            const audioData = audioFile.readSync(error => {
                if (error) {
                    throw new Error("Error reading file: " + error);
                }
            });
            const base64Audio = Buffer.from(audioData).toString('base64'); 
            
            // Removing audio
            audioFile.removeSync()

            return base64Audio;
        } catch (err) {
            getLogger("sendCustomNotificationTask").error(`Error converting audio file to base64: ${err}`)
            return '';
        }
    }
}
