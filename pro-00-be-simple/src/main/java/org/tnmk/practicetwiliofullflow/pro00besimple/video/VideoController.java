package org.tnmk.practicetwiliofullflow.pro00besimple.video;

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
  public VideoRoom createVideoRoom(@PathVariable("videRoomUniqueName") String videRoomUniqueName) {
    VideoRoom videoRoom = videoService.createVideo(videRoomUniqueName);
    return videoRoom;
  }

  @GetMapping("/video/rooms")
  public List<VideoRoom> findAllVideoRooms() {
    return videoService.getAllVideoRooms();
  }
}
