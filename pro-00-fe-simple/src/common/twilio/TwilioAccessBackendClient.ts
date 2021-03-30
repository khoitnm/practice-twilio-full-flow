import TwilioAccess from "./model/TwilioAccess";
import beClient from "../be-client/beClient";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const twilioAccessBackendClient = {

    createAccessToken: async (username: string): Promise<TwilioAccess> => {
        const axiosResponse = await beClient.post(`/twilio/access-info/${username}`, {});
        const twilioAccessInfo: TwilioAccess = axiosResponse.data;
        return twilioAccessInfo;
    }
}
export default twilioAccessBackendClient;