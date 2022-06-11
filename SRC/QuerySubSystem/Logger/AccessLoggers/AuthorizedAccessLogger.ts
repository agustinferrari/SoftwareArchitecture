import { createLogger, format, transports, Logger } from "winston"; 
const { combine, timestamp, label, prettyPrint } = format;
import {UserDTO} from "../../QueryAPI/Models/User";


export class AuthorizedAccessLogger{

    logger: Logger;

    constructor(){
        this.logger = createLogger({
            level: 'info',
            format: combine(
                label({ label: 'Authorized Access' }),
                timestamp(),
                prettyPrint()
            ),
            transports: [
                new transports.File({ filename: 'Logs/Access/authorized.log', level: 'info' }),
                new transports.File({ filename: 'Logs/Access/combined.log', level: 'info'  }),
            ],
        });
    }

    public log(message: string, route:string, user?: UserDTO ){
        this.logger.log({
            level: 'info',
            user: {email: user?.email, role: user?.role},
            route: route,
            message: message

        });
    }
}