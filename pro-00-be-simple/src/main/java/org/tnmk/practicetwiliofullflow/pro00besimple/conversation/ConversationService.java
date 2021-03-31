package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.service.Conversation;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.config.TwilioProperties;

@Service
public class ConversationService {
  private final TwilioProperties twilioProperties;

  public ConversationService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public Conversation createConversation(String friendlyName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation conversation = Conversation.creator(twilioProperties.getServiceSid())
        .setFriendlyName(friendlyName).create();
    return conversation;
  }
}
