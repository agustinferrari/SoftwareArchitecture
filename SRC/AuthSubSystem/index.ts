import { startGRPCServer } from "./GRPC/handlers/Server";
import Server from "./QueryAPI/Server";

const server = new Server();
server.start();
startGRPCServer();
