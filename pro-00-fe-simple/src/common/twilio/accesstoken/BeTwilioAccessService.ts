import TwilioAccess from "./TwilioAccess";
import beAxios from "../../be-axios/beAxios";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const beTwilioAccessService = {

  createAccessToken: async (username: string): Promise<string> => {
    const axiosResponse = await beAxios.post(`/twilio/access-info/${username}`, {});
    const twilioAccessInfo: TwilioAccess = axiosResponse.data;
    return twilioAccessInfo.accessToken;
  }
}
export default beTwilioAccessService;