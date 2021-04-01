import Video, {Room} from "twilio-video";
import backendVideoClient from "./BackendVideoClient";

const twilioVideoClient = {

  startNewVideoRoomOneOnOne: async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    const videoRoom = await backendVideoClient.createRoom(roomUniqueName);
    const room: Room = await Video.connect(accessToken, {name: roomUniqueName});
    return room;
  },

  joinVideoRoom: async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    const room: Room = await Video.connect(accessToken, {name: roomUniqueName});
    return room;
  }
}
export default twilioVideoClient;