import { startGRPCServer } from "./GRPC/handlers/TokenHandler";
import Server from "./AuthAPI/Server";

const server = new Server();
server.start();
startGRPCServer();
