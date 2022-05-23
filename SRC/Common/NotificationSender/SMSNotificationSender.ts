import Axios, { AxiosInstance } from "axios";
import config from "config";
import { INotificationSender } from "./INotificationSender";

export class SMSNotificationSender implements INotificationSender {
  axios: AxiosInstance;
  endpoint: string;
  constructor() {
    this.endpoint = "/messages";
    this.axios = Axios.create({ baseURL: config.get("MessageSender.route") });
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