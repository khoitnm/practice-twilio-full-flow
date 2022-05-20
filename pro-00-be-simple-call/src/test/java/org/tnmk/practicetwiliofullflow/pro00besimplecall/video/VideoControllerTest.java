package org.tnmk.practicetwiliofullflow.pro00besimplecall.video;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.tnmk.practicetwiliofullflow.pro00besimplecall.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimplecall.testinfra.MvcResultHelper;
import org.tnmk.practicetwiliofullflow.pro00besimplecall.testinfra.TestType;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag(TestType.COMPONENT_TEST)
public class VideoControllerTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Autowired
  private VideoService videoService;

  @Test
  public void when_createVideoRoom_returnVideoRoomResult() throws Exception {
    String videoRoomUniqueName = "IntegrationTest_CreateVideoRoom";
    mvc.perform(post("/video/room/" + videoRoomUniqueName))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roomSid").isNotEmpty())
        .andExpect(jsonPath("$.uniqueName").isNotEmpty());
  }

  @Test
  public void when_findAllVideoRooms_returnCreatedRoom() throws Exception {
    String videoRoomUniqueName = "IntegrationTest_FindVideoRoom";
    videoService.createVideo(videoRoomUniqueName);

    MvcResult mvcResult = mvc.perform(get("/video/rooms"))
        .andDo(print())
        .andExpect(status().isOk())
        .andReturn();
    List<VideoRoom> videoRooms = MvcResultHelper.toList(mvcResult, VideoRoom.class);

    Assertions.assertTrue(
        videoRooms.stream().anyMatch(room -> room.getUniqueName().equals(videoRoomUniqueName))
    );
  }
}
