import {AuthorizedAccessLogger} from "./AccessLoggers/AuthorizedAccessLogger"
import {UnauthorizedAccessLogger} from "./AccessLoggers/UnauthorizedAccessLogger"
import {UserDTO} from "../QueryAPI/Models/User";


export class LoggerFacade {

    _authorizedAccessLogger : AuthorizedAccessLogger;
    _unauthorizedAccessLogger : UnauthorizedAccessLogger;

    static _instance : LoggerFacade;

    constructor(){
        this._authorizedAccessLogger = new AuthorizedAccessLogger();
        this._unauthorizedAccessLogger = new UnauthorizedAccessLogger();
    }

    public logAuthorizedAccess(message: string, route:string, user?: UserDTO){
        this._authorizedAccessLogger.log(message, route,user);
    }

    public logUnauthorizedAccess(message: string, route:string, user?: UserDTO){
        this._unauthorizedAccessLogger.log(message,route,user );
    }

    static getLogger() : LoggerFacade{
        if(LoggerFacade._instance){
            return LoggerFacade._instance;
        }else{
            LoggerFacade._instance = new LoggerFacade();
            return LoggerFacade._instance;
        }
    }
}