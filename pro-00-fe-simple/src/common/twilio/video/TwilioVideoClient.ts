import Video, {Room} from "twilio-video";
import backendVideoClient from "./BackendVideoClient";
import authenticationService from "../../../login/AuthenticationService";

const twilioVideoClient = {

  startNewVideoRoomOneOnOne: async (targetParticipantName: string): Promise<Room> => {
    const authenticatedUser = authenticationService.validateAuthenticated();
    const roomUniqueName = `${authenticatedUser.username}_${targetParticipantName}`;
    const videoRoom = await backendVideoClient.createRoom(roomUniqueName);
    const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: videoRoom.uniqueName});
    return room;
  },

  joinVideoRoom: async (roomUniqueName: string): Promise<Room> => {
    const authenticatedUser = authenticationService.validateAuthenticated();
    const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: roomUniqueName});
    return room;
  },

  listRooms: async (): Promise<Room[]> => {
    // const authenticatedUser = authenticationService.validateAuthenticated();
    // const videoRoom = await backendVideoClient.createRoom();
    // const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: videoRoom.uniqueName});
    // return room;
    const room: Room[] = [];
    return room;
  },

}
export default twilioVideoClient;