package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.rest.conversations.v1.conversation.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

@RestController
public class ConversationController {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final ConversationService conversationService;

  public ConversationController(ConversationService conversationService) {
    this.conversationService = conversationService;
  }

  @PostMapping("/conversation")
  public ConversationCreationResult createConversationForParticipants(@RequestBody ConversationCreationRequest conversationCreationRequest) {
    ConversationCreationResult conversationCreationResult = conversationService.createConversation(conversationCreationRequest);
    return conversationCreationResult;
  }

  @PostMapping("/conversation/message")
  public MessageDto sendMessage(@RequestBody SendMessageRequest request) {
    Message message = conversationService.sendMessage(request);

    logger.info("Author {} (participantSid: {}) sent message {}", message.getAuthor(), message.getParticipantSid(), message.getConversationSid());
    return MessageMapper.toMessageResult(message);
  }

  @PatchMapping("/conversation/message")
  public MessageDto updateMessage(@RequestBody UpdateMessageRequest request) {
    MessageDto message = conversationService.updateMessage(request);
    logger.info("Author {} (participantSid: {}) updated message {}", message.getAuthor(), message.getParticipantSid(), message.getConversationSid());
    return message;
  }

  @PatchMapping("/conversation/messages")
  public PageDto<MessageDto> findMessages(@RequestBody FindMessagesRequest request) {
    //
    //
    //    MessageDto message = conversationService.findMessages(request.getConversationSid());
    //    logger.info("Author {} (participantSid: {}) updated message {}", message.getAuthor(), message.getParticipantSid(), message.getConversationSid());
    //    return message;
    // TODO
    return null;
  }
}
