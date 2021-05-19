export default interface BeSendMessageRequest {
  createdByUserIdentity: string;
  conversationSid: string;
  messageBody: string;
  messageAttributes: any;
}