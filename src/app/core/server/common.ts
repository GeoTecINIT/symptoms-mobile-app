import * as grpc from "grpc-web";

export interface GRPCServiceOptions {
    unaryInterceptors: Array<grpc.UnaryInterceptor<any, any>>;
}
