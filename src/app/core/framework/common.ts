import { awarns } from "@awarns/core";

export async function preparePlugin(): Promise<boolean> {
    const isReady = await awarns.isReady();
    // const tasks = await awarns.tasksNotReady$;

    if (isReady) return true;
    try {
        await awarns.prepare();

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
