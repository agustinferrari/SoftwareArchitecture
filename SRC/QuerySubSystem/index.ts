import { Query } from "./DataAccess/Query/Query";
import Server from "./QueryAPI/Server";

const server = new Server();
server.start();

let userRepo = Query.getQuery();
console.log(userRepo.findByEmailOrFail("maria@gmail.com"));
