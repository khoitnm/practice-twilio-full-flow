package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.cleanup;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.ConversationCleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.ConversationCreationRequest;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.ConversationCreationResult;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.ConversationService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.UserCleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.UserService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.BaseIntegrationTest;

import java.lang.invoke.MethodHandles;
import java.util.Arrays;
import java.util.List;

@ActiveProfiles("test")
public class CleanUpTrigger extends BaseIntegrationTest {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @Autowired
  private ConversationCleanUpService conversationCleanUpService;

  @Autowired
  private UserCleanUpService userCleanUpService;

  @Disabled
  @Test()
  public void cleanUp_AllConversations_And_Users() {
    conversationCleanUpService.cleanUpAllConversations();
    userCleanUpService.cleanUpAllUsers();
    logger.info("Clean up all conversations and users");
  }
}
