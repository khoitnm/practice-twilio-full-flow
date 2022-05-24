package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.cleanup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation.ConversationCleanUpService;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.user.UserCleanUpService;

import java.lang.invoke.MethodHandles;

@Service
public class CleanUpService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @Autowired
  private ConversationCleanUpService conversationCleanUpService;

  @Autowired
  private UserCleanUpService userCleanUpService;

  public void cleanUp_AllConversations_And_Users() {
    logger.info("Clean up all conversations and users: starting...");

    conversationCleanUpService.cleanUpAllConversations();
    userCleanUpService.cleanUpAllUsers();
    logger.info("Clean up all conversations and users: ended!!!");
  }
}
