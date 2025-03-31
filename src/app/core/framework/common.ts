import { awarns } from "@awarns/core";
import { Task } from "@awarns/core/tasks";
import { getLogger } from "../utils/logger";
import { autoStarter } from "nativescript-autostarter";

export async function preparePlugin(): Promise<boolean | Task[]> {
    const isReady = await awarns.isReady();
    const tasksNotReady = await awarns.tasksNotReady$;

    if (isReady) return true;
    try {
        await awarns.prepare();
    } catch (e) {
        getLogger("Error: ").error(`Tasks are not ready. Reason: ${e}`);
        return tasksNotReady;
    } finally {
        await launchAutostarterIfNeeded();
        return tasksNotReady.length === 0 ? true : tasksNotReady;
    }
}

async function launchAutostarterIfNeeded() {
    const autoStarterManager = autoStarter.getManager();
    const available = autoStarterManager.canShowAutoStartDialogRequest();
    // this.logger.info(`Can show dialog request: ${available}`);

    if (available) {
        const dialogResponse =
            await autoStarterManager.showAutoStartDialogRequest();
        // this.logger.info(`Dialog response: ${dialogResponse}`);
    }
}
