import { createLogger, format, transports, Logger } from "winston"; 
const { combine, timestamp, label, prettyPrint } = format;

export class UnauthorizedAccessLogger{

    logger: Logger;

    constructor(){
        this.logger = createLogger({
            level: 'info',
            format: combine(
                label({ label: 'Unauthorized Access' }),
                timestamp(),
                prettyPrint()
            ),
            transports: [
                new transports.File({ filename: 'Logs/Access/unauthorized.log', level: 'info' }),
                new transports.File({ filename: 'Logs/Access/combined.log', level: 'info'  }),
            ],
        });
    }

    public log(message: string, credentials: any){
        this.logger.log({
            level: 'info',
            message: message,
            credentials: credentials
        });
    }

}