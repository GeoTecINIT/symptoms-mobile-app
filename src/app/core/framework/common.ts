import { awarns } from "@awarns/core";

export async function preparePlugin(): Promise<boolean> {
    const isReady = await awarns.isReady();
    if (isReady) return true;
    try {
        await awarns.prepare();

        return true;
    } catch (e) {
        return false;
    }
}
