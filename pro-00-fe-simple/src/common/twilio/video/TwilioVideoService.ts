import Video, {Room} from "twilio-video";
import beVideoService from "./BeVideoService";

const TWILIO_ERROR_CODE_CANNOT_START_VIDEO_SOURCE = 0;

class TwilioVideoService {
  startNewVideoRoomOneOnOne = async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    await beVideoService.createRoom(roomUniqueName);
    const room: Room = await Video.connect(accessToken, {name: roomUniqueName});
    return room;
  }

  /**
   * This method will try to join an existing room.
   * If the room doesn't exist, it will try to create a room from Front-end (FE) code.
   * However, it can create a room from FE code only if we enable that feature from Twilio Console (it's enabled by default).
   * If it cannot, then it will throw an exception. And in that case, we'll need to create a VideoRoom from Back-end (BE)
   * @param accessToken
   * @param roomUniqueName
   */
  joinVideoRoom = async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    const room: Room = await Video.connect(accessToken, {name: roomUniqueName});
    return room;
  }

  joinOrStartRoom = async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    let room: Room;
    try {
      room = await this.joinVideoRoom(accessToken, roomUniqueName);
      // We try to join first before trying to creat a new Room later because most of the time, people only trying to join an existing room (with invitation link).
    } catch (error) {
      if (error.code === TWILIO_ERROR_CODE_CANNOT_START_VIDEO_SOURCE) {
        console.error(`Cannot join the room ${roomUniqueName}. The reason could be you are trying to join the same Video Room by many Browsers at the same time. If that's the case, you can try using only one Browser only (with different tab), or try to plug another camera into your computer`, error);
        throw error;
      }
      console.log(`Room ${roomUniqueName} doesn't exist and we also cannot create it from FE, hence we'll create it from BE before joining...`)
      room = await this.startNewVideoRoomOneOnOne(accessToken, roomUniqueName);
    }
    return room;
  }
}

export default new TwilioVideoService();