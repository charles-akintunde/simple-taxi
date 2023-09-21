import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, '..', 'proto', 'driver.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const driverProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new driverProto.DriverService('localhost:50052', grpc.credentials.createInsecure());

export const getDriverByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
        client.GetDriver({ email }, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};
