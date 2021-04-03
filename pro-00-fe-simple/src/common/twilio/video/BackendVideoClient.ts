import beClient from "../../be-client/beClient";
import VideoRoomBE from "./VideoRoomBE";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const backendVideoClient = {

  createRoom: async (videoRoomUniqueName: string): Promise<VideoRoomBE> => {
    const axiosResponse = await beClient.post(`/video/room/${videoRoomUniqueName}`, {});
    const videoRoom: VideoRoomBE = axiosResponse.data;
    return videoRoom;
  },
  endRoom: async (roomSid: string): Promise<void> => {
    await beClient.delete(`/video/room/${roomSid}`, {});
  },
  findAllRooms: async (): Promise<Array<VideoRoomBE>> => {
    const axiosResponse = await beClient.get(`/video/rooms`, {});
    const videoRooms: Array<VideoRoomBE> = axiosResponse.data;
    return videoRooms;
  }

}
export default backendVideoClient;