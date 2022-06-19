import { INotificationSender } from "./INotificationSender";

export class SMSNotificationSender implements INotificationSender {


  constructor() {
  }

  async sendNotification(messageContent: string, destinations: string[]): Promise<void> {
    let jsonMessage = null;

    try{
      jsonMessage = JSON.parse(messageContent);
    }catch(e:any){

    }
    
    let messageBody : any = { type: "SMS", notification: messageContent };

    if(jsonMessage){
      messageBody.notification = jsonMessage;
    }


    destinations.forEach((destination) => {
      messageBody.destination = destination;
      console.log(messageBody);
      // console.log(
      //   "SMS SENT to " + destination + " " + messageBody
      // );
    });
  }
}
