package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.rest.conversations.v1.conversation.Participant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.BaseIntegrationTest;

@ActiveProfiles("test")
public class SendMessageServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationService conversationService;

  @Autowired
  private ConversationFixture conversationFixture;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    ConversationCreationResult givenData = conversationFixture.randomConversationWithParticipants(2);
    try {
      Participant author = givenData.getParticipants().get(0);

      SendMessageRequest sendMessageRequest = new SendMessageRequest();
      sendMessageRequest.setConversationSid(givenData.getConversation().getSid());
      sendMessageRequest.setCreatedByUserIdentity(author.getIdentity());
      sendMessageRequest.setMessageBody("TestMessageBody");

      conversationService.sendMessage(sendMessageRequest);
    } finally {
      // clean up
      conversationFixture.cleanUpConversationAndUsers(givenData);
    }
  }
}
