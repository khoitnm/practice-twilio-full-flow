package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.testdata;

import com.twilio.rest.conversations.v1.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationCreationRequest;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationCreationResultDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.MessageDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.MessageService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.SendMessageRequest;

import java.lang.invoke.MethodHandles;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

@Service
public class ConversationCreationAsyncService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @Autowired
  private ConversationService conversationService;

  @Autowired
  private MessageService messageService;

  @Async
  public CompletableFuture<ConversationCreationResultDto> createConversation(User user01, User user02, String uniqueName) {
    ConversationCreationRequest conversationCreationRequest = new ConversationCreationRequest(
        uniqueName, uniqueName,
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));

    ConversationCreationResultDto result = conversationService.createConversation(conversationCreationRequest);

    sendMessage(user01, result.getConversation().getSid(), "PerformanceTestMessage from " + user01.getIdentity());
    sendMessage(user02, result.getConversation().getSid(), "PerformanceTestMessage from " + user02.getIdentity());
    logger.info("Created conversation: {}", uniqueName);
    //    return new AsyncResult<>(result);
    return CompletableFuture.completedFuture(result);
  }

  private void sendMessage(User user01, String conversationSid, String messageBody) {
    SendMessageRequest sendMessageRequest = new SendMessageRequest();
    sendMessageRequest.setConversationSid(conversationSid);
    sendMessageRequest.setCreatedByUserIdentity(user01.getIdentity());
    sendMessageRequest.setMessageBody(messageBody);
    MessageDto messageResult = messageService.sendMessage(sendMessageRequest);
  }
}
