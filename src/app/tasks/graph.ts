import {
    TaskGraph,
    EventListenerGenerator,
    RunnableTaskDescriptor,
} from "@geotecinit/emai-framework/tasks/graph";

class DemoTaskGraph implements TaskGraph {
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on(
            "startEvent",
            run("acquirePhoneGeolocation")
                .every(5, "minutes")
                .cancelOn("stopEvent")
        );
    }
}

export const demoTaskGraph = new DemoTaskGraph();
