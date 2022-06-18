import { createLogger, format, transports, Logger } from "winston";
const { combine, timestamp, label, prettyPrint } = format;
import { UserDTO } from "../../VotingAPI/Models/User";
import config from "config";

export class ServerErrorLogger {
  logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: combine(label({ label: "Activity" }), timestamp(), prettyPrint()),
      transports: [
        new transports.File({ filename: "Logs/activity/serverError.log", level: "info" }),
        new transports.File({ filename: "Logs/activity/combined.log", level: "info" }),
      ],
    });
  }

  public log(message: string, route: string, user?: UserDTO) {
    this.logger.log({
      level: "info",
      system: config.get("SYS_NAME"),
      user: { email: user?.email, role: user?.role },
      route: route,
      message: message,
    });
  }
}
