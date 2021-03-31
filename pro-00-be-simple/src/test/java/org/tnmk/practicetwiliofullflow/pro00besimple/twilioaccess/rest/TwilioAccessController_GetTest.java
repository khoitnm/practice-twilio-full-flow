package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.rest;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.TestType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag(TestType.COMPONENT_TEST)
public class TwilioAccessController_GetTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Test
  public void test_GetRandomItem_NotFound_Success() throws Exception {
    String userIdentifier = "" + System.nanoTime();
    mvc.perform(post("/twilio/access-info/" + userIdentifier))
        .andDo(print())
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty());
  }
}
