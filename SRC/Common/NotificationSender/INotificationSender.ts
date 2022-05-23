export interface INotificationSender {
  sendNotification(messageContent: string): Promise<boolean>;
}
