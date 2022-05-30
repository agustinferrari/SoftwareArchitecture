import {AuthorizedAccessLogger} from "./AccessLoggers/AuthorizedAccessLogger"
import {UnauthorizedAccessLogger} from "./AccessLoggers/UnauthorizedAccessLogger"

export class LoggerFacade {

    _authorizedAccessLogger : AuthorizedAccessLogger;
    _unauthorizedAccessLogger : UnauthorizedAccessLogger;

    constructor(){
        this._authorizedAccessLogger = new AuthorizedAccessLogger();
        this._unauthorizedAccessLogger = new UnauthorizedAccessLogger();
    }

    public logAuthorizedAccess(message: string, credentials: any){
        this._authorizedAccessLogger.log(message, credentials);
    }

    public logUnauthorizedAccess(message: string, credentials: any){
        this._unauthorizedAccessLogger.log(message, credentials);
    }
}