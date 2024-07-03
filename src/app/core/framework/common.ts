import { awarns } from "@awarns/core";
import { Task } from "@awarns/core/tasks";

export async function preparePlugin(): Promise<boolean | Task[]> {
    // nuevo tipo que tenga success y array de tareas
    const isReady = await awarns.isReady();
    const tasksNotReady = await awarns.tasksNotReady$;
    console.log("Tasks not ready: ", tasksNotReady);

    if (isReady) return true;
    try {
        await awarns.prepare();
        return true;
    } catch (e) {
        console.log(e);
        return tasksNotReady;
    }
}
