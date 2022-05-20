package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import com.twilio.base.Page;
import com.twilio.exception.ApiException;
import com.twilio.http.TwilioRestClient;
import com.twilio.rest.api.v2010.Account;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.user.UserConversation;
import com.twilio.rest.conversations.v1.user.UserConversationReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioErrorCode;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {
  private final TwilioRestClient twilioRestClient;

  public Conversation createConversation(String uniqueName) {
    List<Account> accounts = Account.reader().firstPage(twilioRestClient).getRecords();

    Conversation conversation = Conversation.creator()
        .setUniqueName(uniqueName)
        .create(twilioRestClient);
    log.info("Created conversation {} with uniqueName {}", conversation.getSid(), uniqueName);
    return conversation;
  }

  public void deleteConversation(String conversationSid) {
    Conversation.deleter(conversationSid).delete(twilioRestClient);
  }

  public List<UserConversation> findConversationsOfUser(String userIdentityOrUserSid) {
    try {
      List<UserConversation> result = new ArrayList<>();
      UserConversationReader reader = UserConversation.reader(userIdentityOrUserSid);
      Page<UserConversation> page = null;
      do {
        if (page == null) {
          page = reader.firstPage(twilioRestClient);
        } else {
          page = reader.nextPage(page, twilioRestClient);
        }
        result.addAll(page.getRecords());
      } while (page.hasNextPage());
      return result;
    } catch (ApiException ex) {
      if (TwilioErrorCode.CONVERSATION_NOT_FOUND_CODES.contains(ex.getCode())) {
        return new ArrayList<>();
      } else {
        throw ex;
      }
    }
  }

}
