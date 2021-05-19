import BeVideoRoom from "./BeVideoRoom";
import beAxios from "../../be-axios/beAxios";

/**
 * This is the client class that helps us to communicate with Backend code. It doesn't communicate directly to Twilio SDK.
 */
const beVideoService = {

  createRoom: async (videoRoomUniqueName: string): Promise<BeVideoRoom> => {
    const axiosResponse = await beAxios.post(`/video/room/${videoRoomUniqueName}`, {});
    const videoRoom: BeVideoRoom = axiosResponse.data;
    return videoRoom;
  },
  endRoom: async (roomSid: string): Promise<void> => {
    await beAxios.delete(`/video/room/${roomSid}`, {});
  },
  findAllRooms: async (): Promise<Array<BeVideoRoom>> => {
    const axiosResponse = await beAxios.get(`/video/rooms`, {});
    const videoRooms: Array<BeVideoRoom> = axiosResponse.data;
    return videoRooms;
  }

}
export default beVideoService;