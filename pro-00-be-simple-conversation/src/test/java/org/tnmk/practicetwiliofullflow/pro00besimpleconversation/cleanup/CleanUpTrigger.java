package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.cleanup;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationCleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user.UserCleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.BaseIntegrationTest;

import java.lang.invoke.MethodHandles;

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
