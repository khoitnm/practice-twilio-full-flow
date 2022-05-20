package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.rest.conversations.v1.User;
import com.twilio.rest.conversations.v1.UserReader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;

import java.util.List;

@Slf4j
@Service
public class UserCleanUpService {
  public void cleanUpAllUsers() {
    UserReader reader = User.reader();
    Page<User> page = reader.firstPage();
    do {
      List<User> list = page.getRecords();
      list.parallelStream().forEach(item -> {
        User.deleter(item.getSid()).delete();
        log.info("Deleted userSid " + item.getSid());
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
