import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, '..', 'proto', 'user.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

export const getUserByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
        client.GetUser({ email }, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};