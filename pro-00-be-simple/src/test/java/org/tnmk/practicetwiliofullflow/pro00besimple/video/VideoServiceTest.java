package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.test.BaseIntegrationTest;

@ActiveProfiles("test")
public class VideoServiceTest extends BaseIntegrationTest {

  @Autowired
  private VideoService videoService;

  @Test()
  public void whenCreateAVideo_returnAVideoResponse() {
    VideoRoom videoResponse = videoService.createVideo();
    Assertions.assertNotNull(videoResponse.getRoom());
    //No exception
  }
}
