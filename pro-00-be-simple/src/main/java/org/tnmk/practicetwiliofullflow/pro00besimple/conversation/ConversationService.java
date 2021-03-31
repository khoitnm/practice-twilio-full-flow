package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.service.Conversation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.TwilioProperties;

import java.lang.invoke.MethodHandles;

@Service
public class ConversationService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final TwilioProperties twilioProperties;

  public ConversationService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public Conversation createConversation(String friendlyName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    try {
      Conversation conversation = Conversation.creator(twilioProperties.getServiceSid())
          .setFriendlyName(friendlyName).create();
      logger.info("Created conversation {}", conversation.getSid());
      return conversation;
    } catch (Exception ex) {
      logger.error(ex.getMessage(), ex);
      throw ex;
    }
  }
}
