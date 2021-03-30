import Client from "@twilio/conversations";
import authenticationService from "../../login/AuthenticationService";
import twilioAccessBackendClient from "./TwilioAccessBackendClient";

let twilioClient: Client;

const createClient = async (accessToken: string): Promise<Client> => {
    return await Client.create(accessToken);
};
/**
 * @return refreshed client
 * @param userIdentifier
 */
const refreshNewClient = async (userIdentifier: string): Promise<Client> => {
    const newTwilioAccess = await twilioAccessBackendClient.createAccessToken(userIdentifier);
    return await twilioClient.updateToken(newTwilioAccess.accessToken);
};

const twilioClientFactory = {
    getClient: async (): Promise<Client> => {
        if (!twilioClient) {
            // The authenticatedUser should be initiated from LoginPage
            const authenticatedUser = authenticationService.validateAuthenticated();
            // TODO redirect to login page if there's no authenticatedUser

            twilioClient = await createClient(authenticatedUser.twilioAccessToken);
            twilioClient.on('tokenAboutToExpire', async () => {
                twilioClient = await refreshNewClient(authenticatedUser.username);
            });
            twilioClient.on('tokenExpired', async () => {
                twilioClient = await refreshNewClient(authenticatedUser.username);
            });
        }
        return twilioClient;
    }
}
export default twilioClientFactory;