import {Participant} from "@twilio/conversations/lib/participant";
import {Conversation} from "@twilio/conversations/lib/conversation";
import {Message} from "@twilio/conversations/lib/message";

export default interface CachedConversation {
  conversation: Conversation

  /**
   * We actually can retrieve {@link Conversation.getParticipants()}, but that method will trigger an async request to Twilio server
   * So this field will cache those Participants
   */
  participants: Array<Participant>,

  /**
   * Just the same as {@link participants} field. The only difference is this field excludes localParticipant (the current using user).
   */
  remoteParticipants: Array<Participant>,
  /**
   * When the conversation is empty, there will be no last message.
   */
  lastMessage?: Message
}