import {User} from "@twilio/conversations";
import CachedConversation from "./CachedConversation";
import {Conversation} from "@twilio/conversations/lib/conversation";
import twilioConversationClientFactory from "../common/twilio/conversation/TwilioConversationClientFactory";
import ParticipantUsers from "./ParticipantUsers";
import {Message} from "@twilio/conversations/lib/message";
import {Participant} from "@twilio/conversations/lib/participant";
import {Paginator} from "@twilio/conversations/lib/interfaces/paginator";

class ConversationPreviewServiceSolution02 {

  loadConversationPreviews = async (localUserIdentity: string): Promise<Array<CachedConversation>> => {
    const twilioClient = await twilioConversationClientFactory.getClient(localUserIdentity);
    const cachedConversations: Array<CachedConversation> = [];
    let conversationsPage: Paginator<Conversation> | undefined = undefined;
    do {
      if (!conversationsPage) {
        conversationsPage = await twilioClient.getSubscribedConversations();
      } else {
        conversationsPage = await conversationsPage.nextPage();
      }
      let cachedConversationsPage = await this.loadCachedConversations(localUserIdentity, conversationsPage.items);
      cachedConversations.push(...cachedConversationsPage);
    } while (conversationsPage.hasNextPage);
    return cachedConversations;
  }

  loadCachedConversations = async (localParticipantIdentity: string, conversations: Array<Conversation>): Promise<Array<CachedConversation>> => {
    const conversationPromises: Array<Promise<CachedConversation>> = [];
    for (const conversation of conversations) {
      const cachedConversationPromise: Promise<CachedConversation> = this.loadCachedConversation(localParticipantIdentity, conversation);
      conversationPromises.push(cachedConversationPromise);
    }
    return Promise.all(conversationPromises);
  }

  loadCachedConversation = async (localParticipantIdentity: string, conversation: Conversation): Promise<CachedConversation> => {
    const allParticipantUsersPromise = this.loadAllParticipantUsers(conversation);
    const lastMessagePromise = this.loadLastMessage(conversation);
    const lastMessageReadStatusPromise = this.loadLastMessageUnreadStatus(conversation);
    const [allParticipantUsers, lastMessage, lastMessageUnreadStatus] = await Promise.all([allParticipantUsersPromise, lastMessagePromise, lastMessageReadStatusPromise]);
    const participants = allParticipantUsers.participants;
    const users = allParticipantUsers.users;

    const remoteParticipants = this.filterRemoteParticipants(localParticipantIdentity, participants);
    const cachedConversation: CachedConversation = {
      conversation, participants, users, remoteParticipants, lastMessage, lastMessageUnreadStatus
    };
    return cachedConversation;
  }

  loadAllParticipantUsers = async (conversation: Conversation): Promise<ParticipantUsers> => {
    const participants = await conversation.getParticipants();
    const userPromises: Array<Promise<User>> = [];
    for (const participant of participants) {
      const userPromise = participant.getUser();
      userPromises.push(userPromise);
    }
    const users = await Promise.all(userPromises);
    return {participants, users};
  }

  loadLastMessage = async (conversation: Conversation): Promise<Message | undefined> => {
    if (conversation.lastMessage) {
      const messagesPaginator = await conversation.getMessages(1, conversation.lastMessage.index);
      const lastMessage = messagesPaginator.items.length > 0 ? messagesPaginator.items[0] : undefined;
      return lastMessage;
    } else {
      return undefined;
    }
  }

  loadLastMessageUnreadStatus = async (conversation: Conversation): Promise<boolean | undefined> => {
    const unreadMessageCount = await conversation.getUnreadMessagesCount();
    if (unreadMessageCount) {
      return unreadMessageCount > 0;
    } else {
      return undefined;
    }
  }


  filterRemoteParticipants = (localParticipantIdentity: string, participants: Array<Participant>): Array<Participant> => {
    const remoteParticipants = participants.filter(participant => participant.identity !== localParticipantIdentity);
    return remoteParticipants;
  }
}

const conversationPreviewServiceSolution02 = new ConversationPreviewServiceSolution02();
export default conversationPreviewServiceSolution02;