import { startGRPCServer } from "./GRPC/handlers/Server";
import Server from "./AuthAPI/Server";

const server = new Server();
server.start();
startGRPCServer();
