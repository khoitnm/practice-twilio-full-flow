export default interface BeUpdateMessageRequest<ATT> {
  messageSid: string;
  createdByUserIdentity: string;
  conversationSid: string;
  messageBody?: string;

  /**
   * Any kind of object which could be converted into JSON
   */
  messageAttributes?: ATT;
}