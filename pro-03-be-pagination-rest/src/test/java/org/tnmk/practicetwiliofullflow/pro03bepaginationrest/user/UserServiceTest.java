package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.user;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation.UserService;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.BaseIntegrationTest;

@ActiveProfiles("test")
public class UserServiceTest extends BaseIntegrationTest {

  @Autowired
  private UserService userService;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    User user01 = userService.createUser("user" + System.nanoTime());

    User userFound = userService.getUser(user01.getIdentity());
    Assertions.assertNotNull(userFound.getSid());
  }


}
