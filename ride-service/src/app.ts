import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import * as rideController from './controllers/rideController';

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, 'proto', 'ride.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const rideProto = grpc.loadPackageDefinition(packageDefinition) as any;

const server = new grpc.Server();

server.addService(rideProto.RideService.service, {
    BookRide: rideController.bookRide,
    StartRide: rideController.startRide,
    CompleteRide: rideController.completeRide,
    GetRideStatus: rideController.getRideStatus
});

server.bindAsync('127.0.0.1:50053', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Ride server running on http://127.0.0.1:50053');
    server.start();
});
