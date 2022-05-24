package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation;

import com.twilio.base.Page;
import com.twilio.http.TwilioRestClient;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.ConversationReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationCleanUpService {

  public void cleanUpAllConversations() {
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
