/**
 * The structure is the same as Message object from backend.
 */
export default interface BeMessage<ATT> {
  sid: string;
  author: string;
  conversationSid: string;
  body: string;
  attributes: ATT;
  index: number;
  participantSid: string;
  dateCreated: Date;
  dateUpdated: Date;
}