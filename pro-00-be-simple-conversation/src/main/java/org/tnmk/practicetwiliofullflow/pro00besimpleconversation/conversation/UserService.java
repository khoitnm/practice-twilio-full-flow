package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.User;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;

import java.lang.invoke.MethodHandles;
import java.util.List;

@Service
public class UserService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final TwilioProperties twilioProperties;

  public UserService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
  }

  public User createUser(String userIdentifier) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    User user = User.creator(userIdentifier).create();
    logger.info("Created user {}", user.getSid());
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
        logger.info("Cannot find user {}", userIdentity);
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
}
