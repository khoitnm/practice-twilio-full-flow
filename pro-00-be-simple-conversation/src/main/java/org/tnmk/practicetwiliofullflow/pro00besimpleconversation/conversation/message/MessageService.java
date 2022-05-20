package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message;

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.MessageCreator;
import com.twilio.rest.conversations.v1.conversation.MessageUpdater;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.utils.JsonUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
  private final TwilioProperties twilioProperties;


  public MessageDto sendMessage(SendMessageRequest sendMessageRequest) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());

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
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
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
