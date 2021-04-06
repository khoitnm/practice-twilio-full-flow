package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.service.Conversation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConversationController {
  private final ConversationService conversationService;

  public ConversationController(ConversationService conversationService) {
    this.conversationService = conversationService;
  }

  @PostMapping("/conversation")
  public ResponseEntity createVideoRoom() {
    try {
      Conversation conversation = conversationService.createConversation();
      return new ResponseEntity<>(conversation, HttpStatus.OK);
    } catch (ApiException ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }
  }
}
