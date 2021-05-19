package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.BaseIntegrationTest;

import java.util.Arrays;

@ActiveProfiles("test")
public class SendMessageServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationService conversationService;

  @Autowired
  private UserService userService;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    User user01 = userService.createUser("user" + System.nanoTime());
    User user02 = userService.createUser("user" + System.nanoTime());
    ConversationCreationRequest conversationCreationRequest = new ConversationCreationRequest(
        "conversation" + System.nanoTime(),
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));

    ConversationCreationResult conversationCreationResult = conversationService.createConversation(conversationCreationRequest);

    SendMessageRequest sendMessageRequest = new SendMessageRequest();
    sendMessageRequest.setConversationSid(conversationCreationResult.getConversation().getSid());
    sendMessageRequest.setCreatedByUserIdentity(user01.getIdentity());
    sendMessageRequest.setMessageBody("TestMessageBody");

    MessageDto messageResult = conversationService.sendMessage(sendMessageRequest);

  }
}
