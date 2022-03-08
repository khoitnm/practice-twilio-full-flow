package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.video;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MvcResult;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.MvcResultHelper;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
public class VideoServiceTest extends BaseIntegrationTest {

  @Autowired
  private VideoService videoService;

  @Test()
  public void whenCreateAVideo_returnAVideoResponse() {
    VideoRoom videoResponse = videoService.createVideo("IntegrationTest_createVideo_service");
    Assertions.assertNotNull(videoResponse.getSid());
    Assertions.assertNotNull(videoResponse.getUniqueName());
    //No exception
  }

  @Test
  public void when_findAllVideoRooms_returnCreatedRoom() throws Exception {
    List<VideoRoom> videoRooms = videoService.getAllVideoRooms();
  }
}
