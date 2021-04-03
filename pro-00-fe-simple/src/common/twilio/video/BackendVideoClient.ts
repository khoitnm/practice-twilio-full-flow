import VideoRoomBE from "./VideoRoomBE";
import beAxios from "../../be-axios/beAxios";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const backendVideoClient = {

  createRoom: async (videoRoomUniqueName: string): Promise<VideoRoomBE> => {
    const axiosResponse = await beAxios.post(`/video/room/${videoRoomUniqueName}`, {});
    const videoRoom: VideoRoomBE = axiosResponse.data;
    return videoRoom;
  },
  endRoom: async (roomSid: string): Promise<void> => {
    await beAxios.delete(`/video/room/${roomSid}`, {});
  },
  findAllRooms: async (): Promise<Array<VideoRoomBE>> => {
    const axiosResponse = await beAxios.get(`/video/rooms`, {});
    const videoRooms: Array<VideoRoomBE> = axiosResponse.data;
    return videoRooms;
  }

}
export default backendVideoClient;