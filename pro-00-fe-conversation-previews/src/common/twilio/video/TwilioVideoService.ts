import Video, {Room} from "twilio-video";
import beVideoService from "./BeVideoService";

const TWILIO_ERROR_CODE_CANNOT_START_VIDEO_SOURCE = 0;

class TwilioVideoService {
  startAndJoinRoomOneOnOne = async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    await beVideoService.createRoom(roomUniqueName);
    const room: Room = await this.joinVideoRoom(accessToken, roomUniqueName);
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
    // View more about connect options:
    //  - https://www.twilio.com/docs/video/tutorials/developing-high-quality-video-applications#p2p-or-group-rooms
    //  - https://github.com/twilio/twilio-video-app-react/blob/master/src/utils/useConnectionOptions/useConnectionOptions.ts
    const room: Room = await Video.connect(accessToken, {
      name: roomUniqueName,
      audio: true,
      video: true,
      maxAudioBitrate: 16000, // Max 16MB //For music remove this line
      //Simulcast should be disabled if you are using Peer-to-Peer or 'Go' Rooms.
      preferredVideoCodecs: [{codec: 'VP8', simulcast: false}],
    });
    return room;
  }

  /**
   * This method will join an existing room.
   * If the room is not exist, it will start a new one, and then join that room.
   */
  joinOrStartRoomIfNotExist = async (accessToken: string, roomUniqueName: string): Promise<Room> => {
    let room: Room;
    try {
      room = await this.joinVideoRoom(accessToken, roomUniqueName);
      // We try to join first before trying to creat a new Room later because most of the time, people only trying to join an existing room (with invitation link).
    } catch (error) {
      if (error.code === TWILIO_ERROR_CODE_CANNOT_START_VIDEO_SOURCE) {
        const message = `Cannot join the room ${roomUniqueName}. The reason could be you are using same Camera for different applications at the same time. If that's the case, you can try using only one Browser only (with different tab), or try to plug another camera (or headphone) into your computer`;
        alert(message);
        console.error(message, error);
        throw error;
      }
      console.log(`Room ${roomUniqueName} doesn't exist and we also cannot create it from FE, hence we'll create it from BE before joining...`)
      room = await this.startAndJoinRoomOneOnOne(accessToken, roomUniqueName);
    }
    return room;
  }
}

const twilioVideoService = new TwilioVideoService();
export default twilioVideoService;