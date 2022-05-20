package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

@RestController
public class ConversationController {
  private final ConversationService conversationService;

  public ConversationController(ConversationService conversationService) {
    this.conversationService = conversationService;
  }

  @PostMapping("/conversation")
  public ConversationCreationResultDto createConversationForParticipants(@RequestBody ConversationCreationRequest conversationCreationRequest) {
    ConversationCreationResultDto conversationCreationResult = conversationService.createConversation(conversationCreationRequest);
    return conversationCreationResult;
  }
}
