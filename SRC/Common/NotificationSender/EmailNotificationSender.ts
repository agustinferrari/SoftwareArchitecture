import { INotificationSender } from "./INotificationSender";

export class EmailNotificationSender implements INotificationSender {
  constructor() {}

  async sendNotification(
    messageContent: string,
    destinations: string[]
  ): Promise<void> {
    let jsonMessage = null;
    try{
      jsonMessage = JSON.parse(messageContent);
    }catch(e:any){

    }
    
    let messageBody = {type:"EMAIL", notification: messageContent };

    if(jsonMessage){
      messageBody.notification = jsonMessage;
    }

    destinations.forEach((destination) => {
      console.log(messageBody);
      // console.log(
      //   "Email SENT to " + destination + " " + messageBody
      // );
    });
  }
}
