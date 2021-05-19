import CallMessageBody from "./CallMessageBody";
import CallMessageAttributes from "./CallMessageAttributes";

/**
 * We may temp to split this object into CallTriggerEvent and CallReceiverEvent objects.
 * However, doing that may cause some challenges when we want to manage a list of events, do we???
 *  - I mean there could be a case that we want to store CallTriggerEvent, but then want to update it with another CalLReceiverEvent?
 *
 * RoomSid (not ConversationSid) should be used to distinguished between different call because in the same Conversation,
 * there could be multiple Calls. But each Call only has one roomSid.
 * Note: in the future, when inviting other people which exceed limit of the old Room, hence we may need to creat another Room.
 * Hence there could be a case that one Call can have multiple Rooms.
 */
export default interface CallEvent {
  messageSid: string,
  conversationSid: string,
  roomSid: string,

  //Note: cannot store the whole Message object into this event because when we publish an event, we may not have the full Message object.
  //We may have full Message object when listening to an event, depend on the case.
  messageBody: CallMessageBody,
  messageAttributes: CallMessageAttributes

  /**
   * This is the user who trigger this event (e.g. The user who request a call, or accepted/declined/canceled a call.
   * This is not always the user who started the call.
   */
  conversationAuthorParticipantIdentity: string,
  conversationAuthorParticipantSid: string,

  /**
   * This is the user who started the room call. It's not the person trigger afterward events (such as leave, cancel) on this room.
   */
  videoStartedParticipantIdentity?: string,

  /**
   * This is the date time when we started the call.
   * Note: this is not the date time when this event (could be accept call, decline call, end call, etc.) is triggered.
   */
  callStartedDate: Date,
  /**
   * This is the date time when this event (could be accept call, decline call, end call, etc.) is triggered.
   */
  eventDate: Date
}