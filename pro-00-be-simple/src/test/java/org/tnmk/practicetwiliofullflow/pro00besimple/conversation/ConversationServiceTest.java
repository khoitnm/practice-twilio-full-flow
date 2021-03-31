package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.rest.conversations.v1.service.Conversation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.BaseIntegrationTest;

@ActiveProfiles("test")
public class ConversationServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationService conversationService;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    Conversation conversation = conversationService.createConversation("TestConversation");
    Assertions.assertNotNull(conversation.getSid());
    //No exception
  }
}
