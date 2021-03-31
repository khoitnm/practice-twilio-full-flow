package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.Twilio;
import com.twilio.base.ResourceSet;
import com.twilio.rest.video.v1.Room;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.TwilioProperties;

import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

  private final TwilioProperties twilioProperties;

  public VideoService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public VideoRoom createVideo(String roomUniqueName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Room room = Room.creator()
        .setType(Room.RoomType.GO)
        .setUniqueName(roomUniqueName)
        .create();
    return VideoRoomMapper.toVideoRoom(room);
  }

  public List<VideoRoom> getAllVideoRooms() {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    ResourceSet<Room> roomResourceSet = Room.reader().read();
    List<VideoRoom> videoRooms = VideoRoomMapper.toVideoRooms(roomResourceSet);
    return videoRooms;
  }
}
