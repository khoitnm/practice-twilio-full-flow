package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.cleanup;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.testinfra.BaseIntegrationTest;

@ActiveProfiles("test")
public class CleanUpApplication extends BaseIntegrationTest {
  @Autowired
  private CleanUpService cleanUpService;

  @Disabled
  @Test()
  public void cleanUp_AllConversations_And_Users() {
    cleanUpService.cleanUp_AllConversations_And_Users();
  }
}
