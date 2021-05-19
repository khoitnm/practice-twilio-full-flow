import {Conversation} from "@twilio/conversations/lib/conversation";

const conversationHelper = {
  getParticipantIdentitiesString: async (localParticipantIdentity: string, conversation: Conversation) => {
    try {
      const participants = await conversation.getParticipants();
      const remoteParticipants = participants.filter(participant => participant.identity !== localParticipantIdentity);
      const remoteParticipantIdentities = remoteParticipants.map(remoteParticipant => remoteParticipant.identity);
      const remoteParticipantIdentitiesString = remoteParticipantIdentities.join(", ");
      return remoteParticipantIdentitiesString;
    } catch (error) {
      console.error(`Cannot get participants from conversation ${conversation.uniqueName}`, error);
      return '[Error]';
    }
  }
}
export default conversationHelper;