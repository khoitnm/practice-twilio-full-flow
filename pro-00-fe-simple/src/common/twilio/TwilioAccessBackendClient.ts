import TwilioAccess from "./model/TwilioAccess";
import beClient from "../be-client/beClient";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const twilioAccessBackendClient = {

    createAccessToken: async (username: string): Promise<TwilioAccess> => {
        beClient.post()
        return await twilioAccessBackendService.createAccessToken(username);
    }
}
export default twilioAccessBackendClient;