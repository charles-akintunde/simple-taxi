import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import * as userController from './controllers/userController';

// Load the proto file
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

// Define the UserService interface for TypeScript
interface IUserService {
    RegisterUser: grpc.handleUnaryCall<any, any>;
    LoginUser: grpc.handleUnaryCall<any, any>;
    GetUser: grpc.handleUnaryCall<any, any>;
}

// Load the package definition and cast it to any to bypass TypeScript's strict type checking
const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

// Create a new gRPC server
const server = new grpc.Server();

// Add the UserService to the server
server.addService(userProto.UserService.service, {
    RegisterUser: userController.registerUser,
    LoginUser: userController.loginUser,
    GetUser: userController.getUser
});

// Bind the server to a specific IP and port and start it
server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running on http://127.0.0.1:50051');
    server.start();
});
