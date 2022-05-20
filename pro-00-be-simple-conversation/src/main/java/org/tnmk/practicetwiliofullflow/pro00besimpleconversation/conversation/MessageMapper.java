package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation;

import com.twilio.rest.conversations.v1.conversation.Message;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.utils.JsonUtils;

public class MessageMapper {
  public static MessageDto toMessageResult(Message message) {
    MessageDto result = new MessageDto();
    result.setAccountSid(message.getAccountSid());
    result.setSid(message.getSid());
    result.setAttributes(JsonUtils.toMap(message.getAttributes()));
    result.setBody(message.getBody());
    result.setConversationSid(message.getConversationSid());
    result.setAuthor(message.getAuthor());
    result.setIndex(message.getIndex());
    result.setDateCreated(message.getDateCreated().toOffsetDateTime());
    result.setDateUpdated(message.getDateUpdated().toOffsetDateTime());
    result.setParticipantSid(message.getParticipantSid());
    result.setUrl(message.getUrl());
    return result;
  }
}
