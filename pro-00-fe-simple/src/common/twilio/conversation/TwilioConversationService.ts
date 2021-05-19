import {Conversation} from "@twilio/conversations/lib/conversation";
import {Paginator} from "@twilio/conversations/lib/interfaces/paginator";
import {Message} from "@twilio/conversations/lib/message";
import twilioConversationClientFactory from "./TwilioConversationClientFactory";
import {User} from "@twilio/conversations";
import beConversationService from "./BeConversationService";
import BeConversationCreationRequest from "./BeConversationCreationRequest";

/**
 * Guideline:
 * https://www.twilio.com/docs/conversations/sdk-download-install
 * https://www.npmjs.com/package/@twilio/conversations
 */
export class TwilioConversationService {
  getSubscribedUsers = async (localParticipantIdentifier: string): Promise<Array<User>> => {
    const client = await twilioConversationClientFactory.getClient(localParticipantIdentifier);
    return await client.getSubscribedUsers();
  };
  generateConversationUniqueName = (requestUserIdentifier: string, remoteParticipantIdentifier: string): string => {
    const participants = [requestUserIdentifier, remoteParticipantIdentifier].sort();
    return `${participants[0]}_${participants[1]}`;
  };

  /**
   * the participantIdentifier must have an existing User in Twilio.
   * If there's no corresponding user, it will throw an error.
   * @param mainUserIdentifier
   * @param remoteParticipantIdentifier
   */
  createConversation = async (requestUserIdentifier: string, remoteParticipantIdentifier: string): Promise<Conversation> => {
    const client = await twilioConversationClientFactory.getClient(requestUserIdentifier);

    const request: BeConversationCreationRequest = {
      uniqueName: this.generateConversationUniqueName(requestUserIdentifier, remoteParticipantIdentifier),
      participantIdentities: [requestUserIdentifier, remoteParticipantIdentifier]
    }
    const beConversationCreationResult = await beConversationService.createConversation(request);
    const conversation = await client.getConversationBySid(beConversationCreationResult.conversation.sid);
    //Note: if we create a conversation only on backend, but don't let requestUserIdentifier join that conversation in BE,
    //  then we won't be able to retrieve it from FE code.
    //  The reason is the owner of that conversation will be `system`, hence the requestUserIdentifier won't have permission to see it.

    //This code could be used when we create a conversation from FE, but we are creating conversation from BE, hence we won't use this code.
    //const conversation: Conversation = await client.createConversation();

    //We should not use conversation.add(mainUserIdentifier) because adding to a conversation alone is not enough. It won't be able to see messages in a conversation?
    //We have to subscribe to a conversation to see messages.
    //And to subscribe to a conversation, we should use conversation.join()

    // await conversation.join();//localParticipantIdentifier will join the conversation.
    // await conversation.add(remoteParticipantIdentifier);
    return conversation;
  };

  createConversationIfNotExist = async (requestUserIdentity: string, remoteUserIdentity: string): Promise<Conversation> => {
    const switchedConversationUniqueName = twilioConversationService.generateConversationUniqueName(requestUserIdentity, remoteUserIdentity);
    let switchedConversation = await twilioConversationService.getConversationByUniqueName(requestUserIdentity, switchedConversationUniqueName);
    if (!switchedConversation) {
      switchedConversation = await twilioConversationService.createConversation(requestUserIdentity, remoteUserIdentity);
    }
    return switchedConversation;
  }

  loadConversationsList = async (requestUserIdentifier: string): Promise<Paginator<Conversation>> => {
    const client = await twilioConversationClientFactory.getClient(requestUserIdentifier);
    const paginator = await client.getSubscribedConversations()
    return paginator;
  };
  getConversationBySid = async (requestUserIdentifier: string, conversationSid: string): Promise<Conversation> => {
    const client = await twilioConversationClientFactory.getClient(requestUserIdentifier);
    const conversation = client.getConversationBySid(conversationSid);
    return conversation;
  };
  getConversationByUniqueName = async (requestUserIdentifier: string, conversationUniqueName: string): Promise<Conversation | undefined> => {
    const client = await twilioConversationClientFactory.getClient(requestUserIdentifier);
    try {
      const conversation = await client.getConversationByUniqueName(conversationUniqueName);
      return conversation;
    } catch (error) {
      console.warn(`User '${requestUserIdentifier}' cannot find conversation '${conversationUniqueName}'. Root cause: ${error.message}`, error);
      return undefined;
    }
  };

  getMessages = async (conversation: Conversation): Promise<Paginator<Message>> => {
    return await conversation.getMessages();
  };

  getUser = async (requestUserIdentifier: string, findingUserIdentifier: string): Promise<User> => {
    const client = await twilioConversationClientFactory.getClient(requestUserIdentifier);
    const user = await client.getUser(findingUserIdentifier);
    return user;
  }
}

const twilioConversationService = new TwilioConversationService();
export default twilioConversationService;