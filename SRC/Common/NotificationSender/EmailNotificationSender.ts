import Axios, { AxiosInstance } from "axios";
import config from "config";
import { INotificationSender } from "./INotificationSender";

export class EmailNotificationSender implements INotificationSender {
  axios: AxiosInstance;
  endpoint: string;

  constructor() {
    this.endpoint = config.get("EmailSender.endpoint");
    this.axios = Axios.create({ baseURL: config.get("EmailSender.route") });
  }

  sendNotification(messageContent: string, destinations: string[]): void {
    let messageBody = { notification: messageContent };

    destinations.forEach(destination => {
      console.log("Email SENT to " + destination + " "+ JSON.stringify(messageBody));
    });
  }
}
