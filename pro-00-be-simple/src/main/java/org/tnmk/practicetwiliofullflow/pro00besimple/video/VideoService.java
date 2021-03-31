package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.Twilio;
import com.twilio.rest.video.v1.Room;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.config.TwilioProperties;

import java.util.UUID;

@Service
public class VideoService {

  private final TwilioProperties twilioProperties;

  public VideoService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public VideoResponse createVideo(){
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Room room = Room.creator()
        .setType(Room.RoomType.GO)
        .setUniqueName("Room_"+ UUID.randomUUID().toString())
        .create();
    VideoResponse videoResponse = new VideoResponse();
    videoResponse.setRoom(room);
    return videoResponse;
  }
}
