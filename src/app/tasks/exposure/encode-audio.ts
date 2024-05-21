import {
    File,
} from "@nativescript/core/file-system";

import { Buffer } from "buffer";

import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { EventData } from "@awarns/core/events";

// This task takes the records from user-feedback and questionnaire-answers modals
// and encode the audios in base64 (if present). This task must be done before the 
// writeRecords task. 
export class EncodeAudioTask extends Task {
    constructor() {
        super("encodeAudio", {
            outputEventNames: ["audiosEncoded"]
        })
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        let invocationEventData = invocationEvent.data;
        
        switch (invocationEventData.type) {
            case "user-feedback":
                invocationEventData = this.replaceAudioPathInAnswers(invocationEventData);
                break;
            case "questionnaire-answers":
                invocationEventData = this.replaceAudioPathInQuestions(invocationEventData);
                break;
        }
        return { result: invocationEventData };
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
            const audioFile = File.fromPath(audioFilePath);

            const audioData = audioFile.readSync(error => {
                if (error) {
                    throw new Error("Error reading file: " + error);
                }
            });

            return Buffer.from(audioData).toString('base64');
        } catch (err) {
            console.error("Error converting audio file to base64:", err);
            return '';
        }
    }
}
