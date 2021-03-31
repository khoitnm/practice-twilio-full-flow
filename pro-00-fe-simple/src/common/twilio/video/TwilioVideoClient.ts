import Video, {Room} from "twilio-video";
import backendVideoClient from "./BackendVideoClient";
import authenticationService from "../../../login/AuthenticationService";

const twilioVideoClient = {

  startNewVideoRoomOneOnOne: async (): Promise<Room> => {
    const authenticatedUser = authenticationService.validateAuthenticated();
    const videoRoom = await backendVideoClient.createRoom();
    const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: videoRoom.uniqueName});
    return room;
  },

  joinVideoRoom: async (roomUniqueName: string): Promise<Room> => {
    const authenticatedUser = authenticationService.validateAuthenticated();
    const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: roomUniqueName});
    return room;
  },

}
export default twilioVideoClient;