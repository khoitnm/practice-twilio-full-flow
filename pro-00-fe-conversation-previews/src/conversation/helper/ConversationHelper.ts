import {Conversation} from "@twilio/conversations/lib/conversation";
import {Participant} from "@twilio/conversations/lib/participant";
import CachedConversation from "../CachedConversation";
import {Message} from "@twilio/conversations/lib/message";

class ConversationHelper {
  /**
   * @return each item is the list of participants in the corresponding conversation, in the same order.
   */
  loadParticipantsOfConversations = async (conversations: Array<Conversation>): Promise<Array<Array<Participant>>> => {
    const promises: Array<Promise<Array<Participant>>> = [];
    for (let conversation of conversations) {
      promises.push(conversation.getParticipants());
    }
    return Promise.all(promises);
  };
  /**
   * @return each item is the last message in the corresponding conversation, in the same order.
   */
  loadLastMessageOfConversations = async (conversations: Array<Conversation>): Promise<Array<Message | undefined>> => {
    const promises: Array<Promise<Message | undefined>> = [];
    for (let conversation of conversations) {
      let lastMessagePromise: Promise<Message | undefined>;
      if (conversation.lastMessage) {
        lastMessagePromise = conversation.getMessages(1, conversation.lastMessage.index).then(lastMessages => {
          const lastMessage: Message | undefined = lastMessages.items.length > 0 ? lastMessages.items[0] : undefined;
          return lastMessage;
        });
      } else {
        lastMessagePromise = Promise.resolve(undefined);
      }

      promises.push(lastMessagePromise);
    }
    return Promise.all(promises);
  };

  toCachedConversations = async (localParticipantIdentity: string, conversations: Array<Conversation>): Promise<Array<CachedConversation>> => {
    console.time('checkingTime');
    const participantsInConversations = await this.loadParticipantsOfConversations(conversations);//10 conversations,
    console.timeEnd('checkingTime');
    const lastMessageInConversations = await this.loadLastMessageOfConversations(conversations);
    const cachedConversations: Array<CachedConversation> = [];
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      const participants = participantsInConversations[i];
      const remoteParticipants = this.filterRemoteParticipants(localParticipantIdentity, participants);
      const lastMessage = lastMessageInConversations[i];

      const cachedConversation: CachedConversation = {
        conversation, participants, remoteParticipants, lastMessage
      }
      cachedConversations.push(cachedConversation);
    }
    return cachedConversations;
  }

  toCachedConversation = async (localParticipantIdentity: string, conversation: Conversation): Promise<CachedConversation> => {
    const participants = await conversation.getParticipants();
    const remoteParticipants = this.filterRemoteParticipants(localParticipantIdentity, participants);
    const cachedConversation: CachedConversation = {
      conversation: conversation, participants: participants, remoteParticipants: remoteParticipants
    }
    return cachedConversation;
  }

  filterRemoteParticipants = (localParticipantIdentity: string, participants: Array<Participant>): Array<Participant> => {
    const remoteParticipants = participants.filter(participant => participant.identity !== localParticipantIdentity);
    return remoteParticipants;
  }

  getIdentitiesString = (participants: Array<Participant>): string => {
    const result: string = participants.map(participant => participant.identity).join(", ");
    return result;
  }

  getParticipantIdentitiesString = async (localParticipantIdentity: string, conversation: Conversation) => {
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

const conversationHelper = new ConversationHelper();
export default conversationHelper;
