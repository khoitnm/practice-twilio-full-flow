package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VideoController {
  private final VideoService videoService;

  public VideoController(VideoService videoService) {
    this.videoService = videoService;
  }

  @PostMapping("/video/room/{videRoomUniqueName}")
  public ResponseEntity createVideoRoom(@PathVariable("videRoomUniqueName") String videRoomUniqueName) {
    try {
      VideoRoom videoRoom = videoService.createVideo(videRoomUniqueName);
      return new ResponseEntity<>(videoRoom, HttpStatus.OK);
    } catch (ApiException ex) {
      if (ex.getCode() == 53113) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
      } else {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @GetMapping("/video/rooms")
  public List<VideoRoom> findAllVideoRooms() {
    return videoService.getAllVideoRooms();
  }
}
