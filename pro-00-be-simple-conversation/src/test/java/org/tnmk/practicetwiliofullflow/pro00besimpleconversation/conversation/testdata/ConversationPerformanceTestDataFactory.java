package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.testdata;

import com.twilio.rest.conversations.v1.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.ConversationCreationResultDto;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ConversationPerformanceTestDataFactory {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @Autowired
  private ConversationCreationAsyncService conversationCreationAsyncService;

  public void creatTestData(User user01, User user02, int conversationsCount) {
    List<CompletableFuture<ConversationCreationResultDto>> futures = new ArrayList<>(conversationsCount);
    for (int i = 0; i < conversationsCount; i++) {
      String conversationName = String.format("u%s_u%s_%s", user01.getIdentity(), user02.getIdentity(), i);
      CompletableFuture<ConversationCreationResultDto> result = conversationCreationAsyncService.createConversation(user01, user02, conversationName);
      futures.add(result);
    }
    CompletableFuture.allOf(futures.toArray(new CompletableFuture[conversationsCount])).join();
    logger.info("Create {} conversations", conversationsCount);
  }
}
