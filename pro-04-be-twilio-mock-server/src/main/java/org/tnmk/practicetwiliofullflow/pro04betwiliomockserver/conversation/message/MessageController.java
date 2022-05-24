package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.message;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation.ConversationService;

import java.lang.invoke.MethodHandles;

@RestController
@RequiredArgsConstructor
public class MessageController {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final MessageService messageService;

  @PostMapping("/conversation/message")
  public MessageDto sendMessage(@RequestBody SendMessageRequest request) {
    MessageDto message = messageService.sendMessage(request);
    logger.info("Author {} (participantSid: {}) sent message {}", message.getAuthor(), message.getParticipantSid(), message.getConversationSid());
    return message;
  }

  @PatchMapping("/conversation/message")
  public MessageDto updateMessage(@RequestBody UpdateMessageRequest request) {
    MessageDto message = messageService.updateMessage(request);
    logger.info("Author {} (participantSid: {}) updated message {}", message.getAuthor(), message.getParticipantSid(), message.getConversationSid());
    return message;
  }
}
