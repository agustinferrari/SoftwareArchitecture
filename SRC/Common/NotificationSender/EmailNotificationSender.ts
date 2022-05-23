import Axios, { AxiosInstance } from "axios";
import config from "config";
import { INotificationSender } from "./INotificationSender";

export class EmailNotificationSender implements INotificationSender {
  axios: AxiosInstance;
  endpoint: string;
  constructor() {
    this.endpoint = "/emails";
    this.axios = Axios.create({ baseURL: config.get("EmailSender.route") });
  }

  sendNotification(messageContent: string): Promise<boolean> {
    let messageBody = { notification: messageContent };
    return this.axios
      .post(
        this.endpoint,
        messageBody ,
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then(function () {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  }
}
