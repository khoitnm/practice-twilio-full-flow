import Client from "@twilio/conversations";
import beTwilioAccessService from "../accesstoken/BeTwilioAccessService";

let conversationClient: Client;
let userIdentifier: string;
let conversationAccessToken: string;

/**
 * @return refreshed client
 * @param userIdentifier
 */
const refreshNewClient = async (userIdentifier: string): Promise<void> => {
  const newAccessToken = await beTwilioAccessService.createAccessToken(userIdentifier);
  await conversationClient.updateToken(newAccessToken);
};

const setupClientForUser = async (accessToken: string, userIdentifier: string): Promise<Client> => {
  const twilioClient = await Client.create(accessToken);
  twilioClient.on('tokenAboutToExpire', async () => {
    await refreshNewClient(userIdentifier);
  });
  twilioClient.on('tokenExpired', async () => {
    await refreshNewClient(userIdentifier);
  });
  return twilioClient;
};

const twilioConversationClientFactory = {
  /**
   * This method will get a ConversationClient if it exists.
   * Otherwise, it will create and return a new Conversation.
   * @param newUserIdentifier
   */
  getClient: async (newUserIdentifier: string): Promise<Client> => {
    if (newUserIdentifier !== userIdentifier) {
      userIdentifier = newUserIdentifier;
      conversationAccessToken = await beTwilioAccessService.createAccessToken(newUserIdentifier);
      conversationClient = await setupClientForUser(conversationAccessToken, newUserIdentifier);
    } else {
      if (!conversationClient) {
        conversationClient = await setupClientForUser(conversationAccessToken, newUserIdentifier);
      }
    }
    return conversationClient;
  }
}
export default twilioConversationClientFactory;