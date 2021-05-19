package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.fakebusiness.FakeRequest;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.ConversationCreationRequest;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.ConversationCreationResult;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.ConversationService;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.SendMessageRequest;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.UserService;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.JsonHelper;

import java.time.ZoneId;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DateTimeConversionTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Test
  void getSentryConfig_shouldReturn_NotEmptyValues() throws Exception {
    // Given
    int year = 2021;
    int month = 12;
    int day = 31;
    int hour = 23;
    int min = 23;
    int sec = 23;
    int nano = 999999999;
    //Africa/Cairo
    //Pacific/Honolulu
    //America/New_York
    //America/Sao_Paulo
    FakeRequest fakeRequest = new FakeRequest(year, month, day, hour, min, sec, nano, "America/Sao_Paulo");
    MvcResult mvcResult = mvc
        //when
        .perform(post("/common.rest.fakebusiness/datetime")
            .contentType(MediaType.APPLICATION_JSON)
            .content(JsonHelper.toJson(fakeRequest))
        )

        //then (the result structure should match MessageDto)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.zonedDateTime").isNotEmpty())
        .andExpect(jsonPath("$.offsetDateTime").isNotEmpty())
        .andReturn();

    // When creating a message the first time, it already has dateUpdated value. So we need to compare dateUpdated equals dateCreated.
    // I have to use this approach because could find any solution to compare those values by using jsonPath.
    String json = mvcResult.getResponse().getContentAsString();
    System.out.println(json);
  }
}
