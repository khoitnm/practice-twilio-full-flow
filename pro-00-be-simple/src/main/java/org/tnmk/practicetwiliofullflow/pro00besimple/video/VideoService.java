package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.exception.ApiException;
import com.twilio.rest.video.v1.Room;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.TwilioProperties;

import java.util.List;

@Service
public class VideoService {

  private final TwilioProperties twilioProperties;

  public VideoService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  /**
   * https://www.twilio.com/docs/video/api/rooms-resource
   * Note: Rooms created via the REST API exist for five minutes to allow the first Participant to connect.
   * If no Participants join within five minutes, the Room times out and a new Room must be created.
   * @param roomUniqueName
   * @return
   */
  public VideoRoom createVideo(String roomUniqueName) throws ApiException {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Room room = Room.creator()
        .setType(Room.RoomType.GO)
        .setUniqueName(roomUniqueName)
        .create();
    return VideoRoomMapper.toVideoRoom(room);
  }

  public List<VideoRoom> getAllVideoRooms() {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Page<Room> roomResourceSet = Room.reader().firstPage();
    List<VideoRoom> videoRooms = VideoRoomMapper.toVideoRooms(roomResourceSet.getRecords());
    return videoRooms;
  }

  public VideoRoom endVideo(String roomSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Room room = Room.updater(roomSid, Room.RoomStatus.COMPLETED).update();
    return VideoRoomMapper.toVideoRoom(room);
  }
}
