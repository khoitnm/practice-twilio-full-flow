import ConversationSdkClient from "@twilio/conversations";
import authenticationService from "../../login/AuthenticationService";
import backendTwilioAccessClient from "./accesstoken/BackendTwilioAccessClient";

let twilioConversationSdkClient: ConversationSdkClient;

const createConversationSdkClient = async (accessToken: string): Promise<ConversationSdkClient> => {
    return await ConversationSdkClient.create(accessToken);
};
/**
 * @return refreshed client
 * @param userIdentifier
 */
const refreshNewConversationSdkClient = async (userIdentifier: string): Promise<ConversationSdkClient> => {
    const newTwilioAccess = await backendTwilioAccessClient.createAccessToken(userIdentifier);
    return await twilioConversationSdkClient.updateToken(newTwilioAccess.accessToken);
};

const twilioClientFactory = {
    /**
     * This method should be called only after the user is logged in.
     */
    getConversationClient: async (): Promise<ConversationSdkClient> => {
        if (!twilioConversationSdkClient) {
            // The authenticatedUser should be initiated from LoginPage
            const authenticatedUser = authenticationService.validateAuthenticated();
            // TODO redirect to login page if there's no authenticatedUser

            twilioConversationSdkClient = await createConversationSdkClient(authenticatedUser.twilioAccessToken);
            twilioConversationSdkClient.on('tokenAboutToExpire', async () => {
                twilioConversationSdkClient = await refreshNewConversationSdkClient(authenticatedUser.username);
            });
            twilioConversationSdkClient.on('tokenExpired', async () => {
                twilioConversationSdkClient = await refreshNewConversationSdkClient(authenticatedUser.username);
            });
        }
        return twilioConversationSdkClient;
    }
}
export default twilioClientFactory;