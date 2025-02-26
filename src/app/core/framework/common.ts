import { awarns } from "@awarns/core";
import { Task } from "@awarns/core/tasks";
import { getLogger } from "../utils/logger";

export async function preparePlugin(): Promise<boolean | Task[]> {
    const isReady = await awarns.isReady();
    const tasksNotReady = await awarns.tasksNotReady$;

    if (isReady) return true;
    try {
        await awarns.prepare();
        return true;
    } catch (e) {
        getLogger("Error: ").error(`Tasks are not ready. Reason: ${e}`);
        return tasksNotReady;
    }
}
