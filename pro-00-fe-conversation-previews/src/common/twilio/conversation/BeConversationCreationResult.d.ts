import BeConversation from "./BeConversation";
import BeParticipant from "./BeParticipant";

export default interface BeConversationCreationResult {
  conversation: BeConversation;
  participants: Array<BeParticipant>;
}