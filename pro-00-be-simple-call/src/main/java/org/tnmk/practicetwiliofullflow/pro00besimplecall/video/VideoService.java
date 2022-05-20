package org.tnmk.practicetwiliofullflow.pro00besimplecall.video;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.exception.ApiException;
import com.twilio.rest.video.v1.Room;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimplecall.common.twilio.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro00besimplecall.common.utils.JsonUtils;

import java.lang.invoke.MethodHandles;
import java.util.List;

@Service
public class VideoService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  

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
        Room room = Room.creator()
        .setType(Room.RoomType.GO)
        .setUniqueName(roomUniqueName)
        .create();
    return VideoRoomMapper.toVideoRoom(room);
  }

  public List<VideoRoom> getAllVideoRooms() {
        Page<Room> roomResourceSet = Room.reader().firstPage();
    List<VideoRoom> videoRooms = VideoRoomMapper.toVideoRooms(roomResourceSet.getRecords());
    return videoRooms;
  }

  public VideoRoom endVideo(String roomSid) {
        try {
      Room beforeEndingRoom = Room.fetcher(roomSid).fetch();
      VideoRoom videoRoom = VideoRoomMapper.toVideoRoom(beforeEndingRoom);
      logger.info("Room before ending: {}", JsonUtils.toJsonString(videoRoom));

      Room room = Room.updater(roomSid, Room.RoomStatus.COMPLETED).update();
      return VideoRoomMapper.toVideoRoom(room);
    } catch (ApiException ex) {
      Room room = Room.fetcher(roomSid).fetch();
      VideoRoom videoRoom = VideoRoomMapper.toVideoRoom(room);
      throw new IllegalStateException("Cannot end the room " + roomSid +
          ".\n Room details: " + JsonUtils.toJsonString(videoRoom) +
          ".\n Root cause: " + ex.getMessage(), ex);
    }
  }
}
