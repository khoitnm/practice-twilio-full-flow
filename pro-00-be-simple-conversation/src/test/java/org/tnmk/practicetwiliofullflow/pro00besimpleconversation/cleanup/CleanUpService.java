package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.cleanup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationCleanUpService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user.UserCleanUpService;

import java.lang.invoke.MethodHandles;

@Service
public class CleanUpService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @Autowired
  private ConversationCleanUpService conversationCleanUpService;

  @Autowired
  private UserCleanUpService userCleanUpService;

  public void cleanUp_AllConversations_And_Users() {
    conversationCleanUpService.cleanUpAllConversations();
    userCleanUpService.cleanUpAllUsers();
    logger.info("Clean up all conversations and users");
  }
}
