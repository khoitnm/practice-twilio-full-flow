package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.model.TwilioAccessInfo;

@RestController
public class VideoController {
  private final VideoService videoService;

  public VideoController(VideoService videoService) {
    this.videoService = videoService;
  }

  @PostMapping("/video")
  public VideoResponse createVideo() {
    VideoResponse videoResponse = videoService.createVideo();
    return videoResponse;
  }
}
