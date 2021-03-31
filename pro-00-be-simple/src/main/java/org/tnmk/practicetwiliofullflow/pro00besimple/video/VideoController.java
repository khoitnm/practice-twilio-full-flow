package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VideoController {
  private final VideoService videoService;

  public VideoController(VideoService videoService) {
    this.videoService = videoService;
  }

  @PostMapping("/video/room")
  public VideoRoom createVideoRoom() {
    VideoRoom videoRoom = videoService.createVideo();
    return videoRoom;
  }
}
