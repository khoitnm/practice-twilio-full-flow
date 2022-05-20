package org.tnmk.practicetwiliofullflow.pro00besimplecall.video;

import com.twilio.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
public class VideoController {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final VideoService videoService;
  public static final int ERROR_ALREADY_EXIST = 53113;

  public VideoController(VideoService videoService) {
    this.videoService = videoService;
  }

  @PostMapping("/video/room/{videRoomUniqueName}")
  public VideoRoom createVideoRoom(@PathVariable("videRoomUniqueName") String videRoomUniqueName) {
    try {
      return videoService.createVideo(videRoomUniqueName);
    } catch (ApiException ex) {
      if (ex.getCode() == ERROR_ALREADY_EXIST) {
        throw new IllegalArgumentException("Room already exist. RoomUniqueName: " + videRoomUniqueName);
      } else {
        throw ex;
      }
    }
  }

  @DeleteMapping("/video/room/{roomSid}")
  public VideoRoom endVideoRoom(@PathVariable("roomSid") String roomSid) {
    return videoService.endVideo(roomSid);
  }

  @GetMapping("/video/rooms")
  public List<VideoRoom> findAllVideoRooms() {
    return videoService.getAllVideoRooms();
  }
}
