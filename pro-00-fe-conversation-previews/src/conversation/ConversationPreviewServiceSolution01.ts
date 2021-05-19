import Client, {User} from "@twilio/conversations";
import CachedConversation from "./CachedConversation";
import conversationHelper from "./helper/ConversationHelper";
import {Conversation} from "@twilio/conversations/lib/conversation";
import twilioConversationClientFactory from "../common/twilio/conversation/TwilioConversationClientFactory";
import ParticipantUsers from "./ParticipantUsers";
import {Message} from "@twilio/conversations/lib/message";
import {Participant} from "@twilio/conversations/lib/participant";

class ConversationPreviewServiceSolution01 {
  loadAllSubscribedConversations = async (twilioClient: Client): Promise<Array<Conversation>> => {
    const conversations: Array<Conversation> = [];
    let conversationPaginator = await twilioClient.getSubscribedConversations();
    conversations.push(...conversationPaginator.items);
    while (conversationPaginator.hasNextPage) {
      conversationPaginator = await conversationPaginator.nextPage();
      conversations.push(...conversationPaginator.items);
    }
    return conversations;
  }

  loadConversationPreviews = async (localUserIdentity: string): Promise<Array<CachedConversation>> => {
    const client = await twilioConversationClientFactory.getClient(localUserIdentity);
    const conversations: Array<Conversation> = await this.loadAllSubscribedConversations(client);
    const cachedConversations = await conversationHelper.toCachedConversations(localUserIdentity, conversations);
    return cachedConversations;
  }

}

const conversationPreviewServiceSolution01 = new ConversationPreviewServiceSolution01();
export default conversationPreviewServiceSolution01;