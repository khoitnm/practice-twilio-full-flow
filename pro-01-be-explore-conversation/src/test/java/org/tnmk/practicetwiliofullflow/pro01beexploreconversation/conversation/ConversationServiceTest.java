package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.conversation;

import com.twilio.rest.conversations.v1.User;
import com.twilio.rest.conversations.v1.user.UserConversation;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro01beexploreconversation.testinfra.BaseIntegrationTest;

import java.util.Arrays;
import java.util.List;

@Slf4j
@ActiveProfiles("test")
public class ConversationServiceTest extends BaseIntegrationTest {

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
        "conversation display name" + System.nanoTime(),
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));

    ConversationCreationResult result = conversationService.createConversation(conversationCreationRequest);
    Assertions.assertNotNull(result.getConversation().getSid());
    Assertions.assertTrue(!result.getParticipants().isEmpty());

    List<UserConversation> userConversations = conversationService.findConversationsOfUser(user01.getIdentity());
    Assertions.assertTrue(!userConversations.isEmpty());
    String attributes = userConversations.get(0).getAttributes();
    log.info(attributes);
  }
}
