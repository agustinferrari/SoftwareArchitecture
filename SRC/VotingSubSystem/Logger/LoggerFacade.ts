import { AuthorizedAccessLogger } from "./AccessLoggers/AuthorizedAccessLogger";
import { UnauthorizedAccessLogger } from "./AccessLoggers/UnauthorizedAccessLogger";
import { SuccessfulRequestLogger } from "./RequestLoggers/SuccessfulRequestLogger";
import { BadRequestLogger } from "./RequestLoggers/BadRequestLogger";
import { UserDTO } from "../VotingAPI/Models/User";

export class LoggerFacade {
  _authorizedAccessLogger: AuthorizedAccessLogger;
  _unauthorizedAccessLogger: UnauthorizedAccessLogger;
  _badRequestLogger: BadRequestLogger;
  _successfulRequestLogger: SuccessfulRequestLogger;

  static _instance: LoggerFacade;

  constructor() {
    this._authorizedAccessLogger = new AuthorizedAccessLogger();
    this._unauthorizedAccessLogger = new UnauthorizedAccessLogger();
    this._badRequestLogger = new BadRequestLogger();
    this._successfulRequestLogger = new SuccessfulRequestLogger();
  }

  public logAuthorizedAccess(message: string, route: string, user?: UserDTO) {
    this._authorizedAccessLogger.log(message, route, user);
  }

  public logUnauthorizedAccess(message: string, route: string, user?: UserDTO) {
    this._unauthorizedAccessLogger.log(message, route, user);
  }

  public logSuccessfulRequest(message: string, route: string, user?: UserDTO) {
    this._successfulRequestLogger.log(message, route, user);
  }

  public logBadRequest(message: string, route: string, user?: UserDTO) {
    this._badRequestLogger.log(message, route, user);
  }

  static getLogger(): LoggerFacade {
    if (LoggerFacade._instance) {
      return LoggerFacade._instance;
    } else {
      LoggerFacade._instance = new LoggerFacade();
      return LoggerFacade._instance;
    }
  }
}
