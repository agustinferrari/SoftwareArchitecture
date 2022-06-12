import { Logger } from "winston";
import {UserDTO} from "../../ConfigAPI/Models/User";

export abstract class AccessLogger{

    logger?: Logger;

    public log(message: string, user?: UserDTO){
        this.logger?.log({
            level: 'info',
            message: message,
            email: user?.email,
            role: user?.role
        });
    }
}