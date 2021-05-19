package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.MessageCreator;
import com.twilio.rest.conversations.v1.conversation.MessageUpdater;
import com.twilio.rest.conversations.v1.conversation.Participant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.tnmk.practicetwiliofullflow.pro00besimple.common.utils.JsonUtils;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.TwilioProperties;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;

@Service
public class ConversationService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final TwilioProperties twilioProperties;

  public ConversationService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public ConversationCreationResult createConversation(ConversationCreationRequest conversationCreationRequest) {
    Conversation conversation = createConversation(conversationCreationRequest.getUniqueName());
    List<Participant> participants = new ArrayList<>();
    for (String participantIdentity : conversationCreationRequest.getParticipantIdentities()) {
      Participant participant = joinConversation(participantIdentity, conversation.getSid());
      participants.add(participant);
    }
    return new ConversationCreationResult(conversation, participants);
  }

  public void deleteConversation(String conversationSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation.deleter(conversationSid).delete();
  }

  private Participant joinConversation(String userIdentity, String conversationSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .create();
    return participant;
  }

  private Conversation createConversation(String uniqueName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation conversation = Conversation.creator()
        .setUniqueName(uniqueName)
        .create();
    logger.info("Created conversation {} with uniqueName {}", conversation.getSid(), uniqueName);
    return conversation;
  }

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
