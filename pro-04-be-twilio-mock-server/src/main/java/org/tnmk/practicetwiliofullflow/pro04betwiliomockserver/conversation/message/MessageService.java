package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.message;

import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.MessageCreator;
import com.twilio.rest.conversations.v1.conversation.MessageUpdater;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.common.utils.JsonUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

  public MessageDto sendMessage(SendMessageRequest sendMessageRequest) {

    MessageCreator messageCreator = Message.creator(sendMessageRequest.getConversationSid())
        .setAuthor(sendMessageRequest.getCreatedByUserIdentity())
        .setBody(sendMessageRequest.getMessageBody());
    if (!StringUtils.isEmpty(sendMessageRequest)) {
      messageCreator.setAttributes(JsonUtils.toJsonString(sendMessageRequest.getMessageAttributes()));
    }
    Message sentMessage = messageCreator.create();
    return MessageMapper.toMessageResult(sentMessage);
  }

  public MessageDto updateMessage(UpdateMessageRequest request) {
    MessageUpdater updater = Message.updater(request.getConversationSid(), request.getMessageSid());
    if (!StringUtils.isEmpty(request.getMessageBody())) {
      updater.setBody(request.getMessageBody());
    }
    if (request.getMessageAttributes() != null && !request.getMessageAttributes().isEmpty()) {
      updater.setAttributes(JsonUtils.toJsonString(request.getMessageAttributes()));
    }
    Message message = updater.update();
    return MessageMapper.toMessageResult(message);
  }
}
