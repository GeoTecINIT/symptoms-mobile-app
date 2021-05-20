import { emaiFramework } from "@geotecinit/emai-framework";

export async function preparePlugin(): Promise<boolean> {
    const isReady = await emaiFramework.isReady();
    if (isReady) return true;
    try {
        await emaiFramework.prepare();

        return true;
    } catch (e) {
        return false;
    }
}
