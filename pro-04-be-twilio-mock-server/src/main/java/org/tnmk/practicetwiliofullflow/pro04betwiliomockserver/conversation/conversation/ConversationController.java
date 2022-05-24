package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation;

import com.twilio.rest.conversations.v1.Conversation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ConversationController {
  private final ConversationService conversationService;

  @PostMapping("/conversation")
  public Conversation createConversationOnly(@RequestBody CreateConversationRequestDto requestDto) {
    return conversationService.createConversation(requestDto.getUniqueName());
  }
}
