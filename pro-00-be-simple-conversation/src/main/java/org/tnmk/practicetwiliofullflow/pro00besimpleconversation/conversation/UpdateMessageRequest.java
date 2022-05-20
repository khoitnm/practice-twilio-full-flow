package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation;

import java.util.Map;

public class UpdateMessageRequest {
  private String messageSid;
  private String createdByUserIdentity;
  private String conversationSid;
  private String messageBody;
  private Map<String, String> messageAttributes;

  public String getMessageSid() {
    return messageSid;
  }

  public void setMessageSid(String messageSid) {
    this.messageSid = messageSid;
  }

  public String getCreatedByUserIdentity() {
    return createdByUserIdentity;
  }

  public void setCreatedByUserIdentity(String createdByUserIdentity) {
    this.createdByUserIdentity = createdByUserIdentity;
  }

  public String getConversationSid() {
    return conversationSid;
  }

  public void setConversationSid(String conversationSid) {
    this.conversationSid = conversationSid;
  }

  public String getMessageBody() {
    return messageBody;
  }

  public void setMessageBody(String messageBody) {
    this.messageBody = messageBody;
  }

  public Map<String, String> getMessageAttributes() {
    return messageAttributes;
  }

  public void setMessageAttributes(Map<String, String> messageAttributes) {
    this.messageAttributes = messageAttributes;
  }
}
