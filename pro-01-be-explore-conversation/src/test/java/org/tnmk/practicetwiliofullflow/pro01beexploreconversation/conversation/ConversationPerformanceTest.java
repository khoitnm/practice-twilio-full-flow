package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.conversation;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro01beexploreconversation.testinfra.BaseIntegrationTest;

import java.util.Arrays;

@ActiveProfiles("test")
public class ConversationPerformanceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationPerformanceTestDataFactory conversationPerformanceTestDataFactory;

  @Autowired
  private UserService userService;

  @Test()
  public void creatTestData() {
    User user01 = userService.createUser("test"+System.nanoTime());
    User user02 = userService.createUser("test"+System.nanoTime());

    conversationPerformanceTestDataFactory.creatTestData(user01, user02, 5);
  }
}
