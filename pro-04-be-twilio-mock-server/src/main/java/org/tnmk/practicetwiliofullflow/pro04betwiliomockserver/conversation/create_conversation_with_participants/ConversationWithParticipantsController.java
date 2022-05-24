package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConversationWithParticipantsController {
  private final ConversationWithParticipantsService conversationWithParticipantsService;

  public ConversationWithParticipantsController(ConversationWithParticipantsService conversationWithParticipantsService) {
    this.conversationWithParticipantsService = conversationWithParticipantsService;
  }

  @PostMapping("/conversation/participants")
  public CreateConversationWithParticipantsResultDto createConversationWithParticipants(
      @RequestBody CreateConversationWithParticipantsRequestDto conversationCreationRequest) {
    CreateConversationWithParticipantsResultDto conversationCreationResult = conversationWithParticipantsService.createConversationWithParticipants(
        conversationCreationRequest);
    return conversationCreationResult;
  }
}
