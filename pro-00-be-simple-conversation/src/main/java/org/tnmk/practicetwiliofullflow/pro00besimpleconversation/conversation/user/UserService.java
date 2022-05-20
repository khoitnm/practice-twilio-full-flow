package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user;

import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.User;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.lang.invoke.MethodHandles;
import java.util.List;

@Service
public class UserService {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  public User createUser(String userIdentifier) {
    User user = User.creator(userIdentifier).create();
    logger.info("Created user {}", user.getSid());
    return user;
  }

  public User getUser(String userIdentity) {
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
    List<User> users = User.reader().firstPage().getRecords();
    return users;
  }
}
