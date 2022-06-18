import { INotificationSender } from "./INotificationSender";

export class EmailNotificationSender implements INotificationSender {
  constructor() {}

  async sendNotification(
    messageContent: string,
    destinations: string[]
  ): Promise<void> {
    let jsonMessage = null;
    //TODO PASAR A QUE SI RECIBE UN STRING PARSEABLE A JSON SE IMPRIMA BIEN

    try{
      jsonMessage = JSON.parse(messageContent);
    }catch(e:any){

    }
    
    let messageBody = { notification: messageContent };

    if(jsonMessage){
      messageBody = jsonMessage;
    }


    destinations.forEach((destination) => {
      console.log(
        "Email SENT to " + destination + " " + JSON.stringify(messageBody)
      );
    });
  }
}
