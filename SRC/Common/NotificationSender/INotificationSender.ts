export interface INotificationSender {
  sendNotification(messageContent: string, destinations: string[]): Promise<void>;
}
