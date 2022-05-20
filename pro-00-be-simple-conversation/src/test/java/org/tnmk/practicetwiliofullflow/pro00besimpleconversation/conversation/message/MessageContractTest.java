package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.ConversationWithParticipantsService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.CreateConversationWithParticipantsRequestDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.CreateConversationWithParticipantsResultDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user.UserService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.BaseIntegrationTest;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.JsonHelper;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MessageContractTest extends BaseIntegrationTest {
  @Autowired
  private MockMvc mvc;

  @Autowired
  private ConversationWithParticipantsService conversationWithParticipantsService;

  @Autowired
  private UserService userService;

  @Test
  void getSentryConfig_shouldReturn_NotEmptyValues() throws Exception {
    // Given

    // Users (Participants)
    User user01 = userService.createUser("user" + System.nanoTime());
    User user02 = userService.createUser("user" + System.nanoTime());

    // Conversation
    CreateConversationWithParticipantsRequestDto conversationCreationRequest = new CreateConversationWithParticipantsRequestDto(
        "conversation" + System.nanoTime(),
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));
    CreateConversationWithParticipantsResultDto result = conversationWithParticipantsService.createConversationWithParticipants(conversationCreationRequest);

    //Message
    SendMessageRequest sendMessageRequest = new SendMessageRequest();
    sendMessageRequest.setConversationSid(result.getConversation().getSid());
    sendMessageRequest.setCreatedByUserIdentity(user01.getIdentity());
    sendMessageRequest.setMessageBody("TestMessageBody");

    MvcResult mvcResult = mvc
        //when
        .perform(post("/conversation/message")
            .contentType(MediaType.APPLICATION_JSON)
            .content(JsonHelper.toJson(sendMessageRequest))
        )

        //then (the result structure should match MessageDto)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.sid").isNotEmpty())
        .andExpect(jsonPath("$.index").isNotEmpty())
        .andExpect(jsonPath("$.accountSid").isNotEmpty())
        .andExpect(jsonPath("$.conversationSid").isNotEmpty())
        .andExpect(jsonPath("$.body").isNotEmpty())
        .andExpect(jsonPath("$.dateCreated").isNotEmpty())
        .andExpect(jsonPath("$.author").value(String.valueOf(sendMessageRequest.getCreatedByUserIdentity())
        )).andReturn();

    // When creating a message the first time, it already has dateUpdated value. So we need to compare dateUpdated equals dateCreated.
    // I have to use this approach because could find any solution to compare those values by using jsonPath.
    String json = mvcResult.getResponse().getContentAsString();
    System.out.println(json);
  }
}
