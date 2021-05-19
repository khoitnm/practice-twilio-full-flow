import beAxios from "../../be-axios/beAxios";
import BeUser from "./BeUser";
import BeConversationCreationRequest from "./BeConversationCreationRequest";
import BeConversationCreationResult from "./BeConversationCreationResult";
import BeSendMessageRequest from "./BeSendMessageRequest";
import BeMessage from "./BeMessage";
import BeUpdateMessageRequest from "./BeUpdateMessageRequest";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const beConversationService = {

  createConversation: async (request: BeConversationCreationRequest): Promise<BeConversationCreationResult> => {
    const axiosResponse = await beAxios.post(`/conversation`, request);
    const result = axiosResponse.data;
    return result;
  },
  createUser: async (identifier: string): Promise<BeUser> => {
    const axiosResponse = await beAxios.post(`/user/${identifier}`, {});
    const result = axiosResponse.data;
    return result;
  },
  findAllUsers: async (): Promise<Array<BeUser>> => {
    const axiosResponse = await beAxios.get(`/users`, {});
    const result: Array<BeUser> = axiosResponse.data;
    return result;
  },
  sendMessage: async (request: BeSendMessageRequest): Promise<BeMessage<any>> => {
    const axiosResponse = await beAxios.post(`/conversation/message`, request);
    const result = axiosResponse.data;
    return result;
  },
  updateMessage: async (request: BeUpdateMessageRequest<any>): Promise<BeMessage<any>> => {
    const axiosResponse = await beAxios.patch(`/conversation/message`, request);
    const result = axiosResponse.data;
    return result;
  }
}
export default beConversationService;