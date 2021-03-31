import beClient from "../../be-client/beClient";
import VideoRoom from "./VideoRoom";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const backendVideoClient = {

  createRoom: async (videoRoomUniqueName: string): Promise<VideoRoom> => {
    const axiosResponse = await beClient.post(`/video/room/${videoRoomUniqueName}`, {});
    const videoRoom: VideoRoom = axiosResponse.data;
    return videoRoom;
  }
}
export default backendVideoClient;