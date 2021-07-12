import * as grpc from "grpc-web";
import {
    AuthManager,
    firebaseAuthManager,
} from "~/app/core/auth/firebase-auth-manager.ts";
import { getLogger } from "~/app/core/utils/logger";

export class GRPCAuthInterceptor implements grpc.UnaryInterceptor<any, any> {
    constructor(private authManager: AuthManager = firebaseAuthManager) {}

    intercept(
        request: grpc.Request<any, any>,
        invoker: (
            request: grpc.Request<any, any>
        ) => Promise<grpc.UnaryResponse<any, any>>
    ): Promise<grpc.UnaryResponse<any, any>> {
        const logger = getLogger("GRPCAuthInterceptor");
        logger.debug((request.getMethodDescriptor() as any).name);

        return this.authManager.authToken().then((token) => {
            const metadata = request.getMetadata();
            metadata.authorization = `Bearer ${token}`;

            return invoker(request);
        });
    }
}
