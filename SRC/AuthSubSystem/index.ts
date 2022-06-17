import { startGRPCServer } from "./GRPC/handlers/server";
import Server from "./QueryAPI/Server";

const server = new Server();
server.start();
startGRPCServer();
