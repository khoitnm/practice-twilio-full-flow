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

import java.util.Collection;
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

    int messagesCount = 8;
    int pageSize = 3;
    try {

      List<Message> messages = messageFixture.createMessages(conversation.getSid(), firstParticipant.getIdentity(), messagesCount);
      logMessages("Given Messages", messages);

      // WHEN
      Page<Message> page00 = conversationService.findMessages(conversation.getSid(), 0, pageSize);
      Page<Message> page01 = conversationService.findMessages(conversation.getSid(), 1, pageSize);
      Page<Message> page02 = conversationService.findMessages(conversation.getSid(), 2, pageSize);

      // the pageIndex is too high, there will be no data in this page.
      Page<Message> pageNoExist = conversationService.findMessages(conversation.getSid(), Integer.MAX_VALUE, pageSize);

      logMessages("page00", page00.getRecords());
      logMessages("page01", page01.getRecords());
      logMessages("page02", page02.getRecords());

      // THEN
      Assertions.assertEquals(pageSize, page00.getRecords().size());
      Assertions.assertEquals(pageSize, page01.getRecords().size());
      Assertions.assertEquals(messagesCount % pageSize, page02.getRecords().size());
      Assertions.assertTrue(pageNoExist.getRecords().isEmpty());
      Assertions.assertFalse(pageNoExist.hasNextPage());
    } finally {
      // clean up
      conversationFixture.cleanUpConversationAndUsers(result);
    }
  }

  @Test
  public void test_findMessages_afterDeleting() {
    // GIVEN
    ConversationCreationResult result = conversationFixture.randomConversationWithParticipants(2);
    Conversation conversation = result.getConversation();
    Participant firstParticipant = result.getParticipants().get(0);

    int messagesCount = 4;
    int pageSize = 2;
    try {

      List<Message> messages = messageFixture.createMessages(conversation.getSid(), firstParticipant.getIdentity(), messagesCount);
      logMessages("Given Messages", messages);

      // WHEN
      Page<Message> page00_BeforeRemoving = conversationService.findMessages(conversation.getSid(), 0, pageSize);
      Page<Message> page01_BeforeRemoving = conversationService.findMessages(conversation.getSid(), 1, pageSize);
      Message firstMessageInPage00 = page00_BeforeRemoving.getRecords().get(0);

      conversationService.deleteMessage(conversation.getSid(), firstMessageInPage00.getSid());
      Page<Message> page00_AfterRemoving = conversationService.findMessages(conversation.getSid(), 0, pageSize);
      Page<Message> page01_AfterRemoving = conversationService.findMessages(conversation.getSid(), 1, pageSize);

      logMessages("page00_BeforeRemoving", page00_BeforeRemoving.getRecords());
      logMessages("page00_AfterRemoving", page00_AfterRemoving.getRecords());
      logMessages("page01_BeforeRemoving", page01_BeforeRemoving.getRecords());
      logMessages("page01_AfterRemoving", page01_AfterRemoving.getRecords());

      // THEN
      assertMessagesEquals(false, page00_BeforeRemoving.getRecords(), page00_AfterRemoving.getRecords());
      assertMessagesEquals(true, page01_BeforeRemoving.getRecords(), page01_AfterRemoving.getRecords());
    } finally {
      // clean up
      conversationFixture.cleanUpConversationAndUsers(result);
    }
  }

  private void assertMessagesEquals(boolean expectEquals, List<Message> a, List<Message> b) {
    Assertions.assertEquals(expectEquals,
        equals(
            toMessageSids(a),
            toMessageSids(b)
        )
    );
  }

  private <T> boolean equals(Collection<T> a, Collection<T> b) {
    if (a.size() != b.size()) {
      return false;
    }
    return a.containsAll(b);
  }

  public List<String> toMessageSids(List<Message> messages) {
    return messages.stream().map(Message::getSid).collect(Collectors.toList());
  }

  private void logMessages(String prefixMessage, List<Message> messages) {
    log.info(prefixMessage + "\n\t{}", messages.stream()
        .map(message -> String.format("[%s-%s]'%s'", message.getIndex(), message.getSid(), message.getBody()))
        .collect(Collectors.joining("\n\t")));
  }
}
