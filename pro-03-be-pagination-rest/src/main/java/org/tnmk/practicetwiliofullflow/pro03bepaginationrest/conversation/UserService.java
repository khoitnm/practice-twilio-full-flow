package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.common.twilio.TwilioProperties;

import java.util.List;

@Slf4j
@Service
public class UserService {
  private final TwilioProperties twilioProperties;

  public UserService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public User createUser(String userIdentifier) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    User user = User.creator(userIdentifier).create();
    log.info("Created user {}", user.getSid());
    return user;
  }

  public User getUser(String userIdentity) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    User user;
    try {
      user = User.fetcher(userIdentity).fetch();
    } catch (ApiException apiException) {
      if (apiException.getStatusCode() == HttpStatus.SC_NOT_FOUND) {
        user = null;
        log.info("Cannot find user {}", userIdentity);
      } else {
        throw apiException;
      }
    }
    return user;
  }

  public List<User> findFirstPageUsersInConversationService() {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    List<User> users = User.reader().firstPage().getRecords();
    return users;
  }

  public void deleteUser(String userIdentityOrUserSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    User.deleter(userIdentityOrUserSid).delete();
    log.info("Deleted user {}", userIdentityOrUserSid);
  }
}
