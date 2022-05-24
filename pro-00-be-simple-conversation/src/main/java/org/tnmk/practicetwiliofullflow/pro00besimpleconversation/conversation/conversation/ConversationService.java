package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import com.twilio.base.Page;
import com.twilio.exception.ApiException;
import com.twilio.http.TwilioRestClient;
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

  public Conversation createConversation(String uniqueName) {
    try {
      Conversation conversation = Conversation.creator()
          .setUniqueName(uniqueName)
          .create();
      log.info("Created conversation {} with uniqueName {}", conversation.getSid(), uniqueName);
      return conversation;
    } catch (ApiException apiException) {
      String message = String.format("status: %s, code: %s, message: %s, details: %s", apiException.getStatusCode(), apiException.getCode(),
          apiException.getMessage(), apiException.getDetails());
      throw new IllegalArgumentException(message, apiException);
    }
  }

  public void deleteConversation(String conversationSid) {
    Conversation.deleter(conversationSid).delete();
  }

  public List<UserConversation> findConversationsOfUser(String userIdentityOrUserSid) {
    try {
      List<UserConversation> result = new ArrayList<>();
      UserConversationReader reader = UserConversation.reader(userIdentityOrUserSid);
      Page<UserConversation> page = null;
      do {
        if (page == null) {
          page = reader.firstPage();
        } else {
          page = reader.nextPage(page);
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
