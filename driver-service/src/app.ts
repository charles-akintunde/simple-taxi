import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import * as driverController from "./controllers/driverControllers"

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

const server = new grpc.Server();

server.addService(driverProto.DriverService.service, {
    RegisterDriver: driverController.registerDriver,
    LoginDriver: driverController.loginDriver,
    UpdateLocation: driverController.updateLocation,
    GetDriver: driverController.getDriver
});

server.bindAsync('127.0.0.1:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Driver Service running on http://127.0.0.1:50052');
    server.start();
});
