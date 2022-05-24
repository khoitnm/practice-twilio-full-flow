package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation;

import com.twilio.rest.conversations.v1.User;
import com.twilio.rest.conversations.v1.user.UserConversation;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants.ConversationWithParticipantsService;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants.CreateConversationWithParticipantsRequestDto;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants.CreateConversationWithParticipantsResultDto;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.user.UserService;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.testinfra.BaseIntegrationTest;

import java.util.Arrays;
import java.util.List;

@Slf4j
@ActiveProfiles("test")
public class ConversationWithParticipantsServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationService conversationService;
  @Autowired
  private ConversationWithParticipantsService conversationWithParticipantsService;
  @Autowired
  private UserService userService;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    User user01 = userService.createUser("user" + System.nanoTime());
    User user02 = userService.createUser("user" + System.nanoTime());
    CreateConversationWithParticipantsRequestDto conversationCreationRequest = new CreateConversationWithParticipantsRequestDto(
        "conversation" + System.nanoTime(),
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));

    CreateConversationWithParticipantsResultDto result = conversationWithParticipantsService.createConversationWithParticipants(conversationCreationRequest);
    Assertions.assertNotNull(result.getConversation().getSid());
    Assertions.assertTrue(!result.getParticipants().isEmpty());

    List<UserConversation> userConversations = conversationService.findConversationsOfUser(user01.getIdentity());
    Assertions.assertTrue(!userConversations.isEmpty());
    String attributes = userConversations.get(0).getAttributes();
    log.info(attributes);
  }
}
