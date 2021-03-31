package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.test.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.test.TestType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag(TestType.COMPONENT_TEST)
public class VideoControllerTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Test
  public void when_createVideoRoom_returnVideoRoomResult() throws Exception {
    String userIdentifier = "" + System.nanoTime();
    mvc.perform(post("/video/room"))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roomSid").isNotEmpty())
        .andExpect(jsonPath("$.uniqueName").isNotEmpty());
  }
}
