package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.cleanup.CleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.JsonHelper;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
class ConversationContractTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Autowired
  private CleanUpService cleanUpService;

  @Test
  void createConversation() throws Exception {
    try {
      // Given
      CreateConversationRequestDto requestDto = new CreateConversationRequestDto("ConversationName_" + UUID.randomUUID());
      MvcResult mvcResult = mvc
          //when
          .perform(post("/conversation")
              .contentType(MediaType.APPLICATION_JSON)
              .content(JsonHelper.toJson(requestDto))
          )

          //then (the result structure should match MessageDto)
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.sid").isNotEmpty())
          .andExpect(jsonPath("$.uniqueName").isNotEmpty())
          .andExpect(jsonPath("$.state").isNotEmpty())
          .andReturn();

      // When creating a message the first time, it already has dateUpdated value. So we need to compare dateUpdated equals dateCreated.
      // I have to use this approach because could find any solution to compare those values by using jsonPath.
      String json = mvcResult.getResponse().getContentAsString();
      log.info("Result: \n" + json);
    } finally {
      //cleanUpService.cleanUp_AllConversations_And_Users();
    }
  }
}
