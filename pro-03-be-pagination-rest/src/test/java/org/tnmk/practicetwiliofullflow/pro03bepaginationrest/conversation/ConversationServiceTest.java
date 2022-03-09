package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.base.Page;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.Participant;
import com.twilio.rest.conversations.v1.user.UserConversation;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.BaseIntegrationTest;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@ActiveProfiles("test")
public class ConversationServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationService conversationService;

  @Autowired
  private ConversationFixture conversationFixture;
  @Autowired
  private MessageFixture messageFixture;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    ConversationCreationResult result = conversationFixture.randomConversationWithParticipants(2);
    try {
      Assertions.assertNotNull(result.getConversation().getSid());
      Assertions.assertTrue(!result.getParticipants().isEmpty());

      List<UserConversation> userConversations = conversationService.findConversationsOfUser(result.getParticipants().get(0).getIdentity());
      Assertions.assertTrue(!userConversations.isEmpty());
      String attributes = userConversations.get(0).getAttributes();
      log.info(attributes);
    } finally {
      // clean up
      conversationFixture.cleanUpConversationAndUsers(result);
    }
  }

  @Test
  public void test_findMessages() {
    // GIVEN
    ConversationCreationResult result = conversationFixture.randomConversationWithParticipants(2);
    Conversation conversation = result.getConversation();
    Participant firstParticipant = result.getParticipants().get(0);

    int messagesCount = 3;
    int pageSize = 2;
    try {

      List<Message> messages = messageFixture.createMessages(conversation.getSid(), firstParticipant.getIdentity(), 3);
      logMessages("Given Messages", messages);

      // WHEN
      Page<Message> firstPage = conversationService.findMessages(conversation.getSid(), 0, pageSize);
      Page<Message> nextPage = conversationService.findMessages(conversation.getSid(), 1, pageSize);

      logMessages("First Page", messages);
      logMessages("Next Page", messages);

      String url = firstPage.getUrl("/");

      // THEN
      log.info("page url: " + url);
      Assertions.assertEquals(pageSize, firstPage.getRecords().size());
      Assertions.assertEquals(messagesCount % pageSize, nextPage.getRecords().size());
    } finally {
      // clean up
      conversationFixture.cleanUpConversationAndUsers(result);
    }
  }

  private void logMessages(String prefixMessage, List<Message> messages) {
    log.info(prefixMessage + "\n\t{}", messages.stream().map(Message::getBody).collect(Collectors.joining("\n\t")));
  }
}
