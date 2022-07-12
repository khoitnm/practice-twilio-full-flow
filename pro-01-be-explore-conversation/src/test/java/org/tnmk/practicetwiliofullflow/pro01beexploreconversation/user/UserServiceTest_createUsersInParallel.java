package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.user;

import com.twilio.rest.conversations.v1.User;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro01beexploreconversation.conversation.UserService;
import org.tnmk.practicetwiliofullflow.pro01beexploreconversation.testinfra.BaseIntegrationTest;

import java.util.stream.IntStream;

@Slf4j
@ActiveProfiles("test")
public class UserServiceTest_createUsersInParallel extends BaseIntegrationTest {

  @Autowired
  private UserService userService;

  @Test
  public void createUsers() {
    String userIdentity = "" + System.nanoTime();
    IntStream.range(0, 100)
        .parallel()
        .forEach(i -> createUser(userIdentity));
  }

  private void createUser(String userIdentity) {
    try {
      User user = userService.createUser(userIdentity);
      log.info("Successfully created user with identity {}: the sid: {}", userIdentity, user.getSid());
    } catch (Exception ex) {
      log.error("Cannot create user with identity {}. Root cause: {}", userIdentity, ex.getMessage());
    }
  }
}
