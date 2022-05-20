package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.ConversationReader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;

import java.util.List;

@Slf4j
@Service
public class ConversationCleanUpService {
  private final TwilioProperties twilioProperties;

  public ConversationCleanUpService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public void cleanUpAllConversations() {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    ConversationReader reader = Conversation.reader();
    Page<Conversation> page = reader.firstPage();
    do {
      List<Conversation> list = page.getRecords();
      list.parallelStream().forEach(item -> {
        Conversation.deleter(item.getSid()).delete();
        log.info("Deleted conversationSid " + item.getSid());
      });
      if (page.hasNextPage()) {
        page = reader.nextPage(page);
      } else {
        page = null;
      }
    }
    while (page != null);
  }
}
