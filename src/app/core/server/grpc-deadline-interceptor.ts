import * as grpc from "grpc-web";

const DEFAULT_DEADLINE = 10 * 1000;

export class GRPCDeadlineInterceptor implements grpc.UnaryInterceptor<any, any> {

    intercept(
        request: grpc.Request<any, any>,
        invoker: (
            request: grpc.Request<any, any>
        ) => Promise<grpc.UnaryResponse<any, any>>
    ): Promise<grpc.UnaryResponse<any, any>> {
        const deadline = Date.now() + DEFAULT_DEADLINE;

        const metadata = request.getMetadata();
        metadata.deadline = deadline.toString();

        return invoker(request);
    }
}
