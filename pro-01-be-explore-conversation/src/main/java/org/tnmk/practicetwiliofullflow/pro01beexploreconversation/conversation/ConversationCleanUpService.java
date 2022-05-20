package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.conversation;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.ConversationReader;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro01beexploreconversation.common.twilio.TwilioProperties;

import java.util.List;

@Service
public class ConversationCleanUpService {
  

  public void cleanUpAllConversations() {
        ConversationReader reader = Conversation.reader();
    Page<Conversation> page = reader.firstPage();
    do {
      List<Conversation> list = page.getRecords();
      list.parallelStream().forEach(item -> {
        Conversation.deleter(item.getSid()).delete();
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
