package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.rest.TwilioAccessController_GetTest;

/**
 * This test case will be run in a different Spring Context compare to
 * {@link TwilioAccessController_GetTest}
 * and {@link org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.rest.ItemController_PostTest}
 * because this doesn't use:<br/>
 * <code>
 * SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
 * AutoConfigureMockMvc
 * </code>
 */
@ActiveProfiles("test")
@SpringBootTest
// Note: if we use this @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
//  we'll get conflict web server port.
//
//  The reason is: this test case doesn't have @AutoConfigureMockMvc, hence it will try to create a new SpringContext.
//  But then, the previous SpringContext already start a web server with the same port.
//  Hence, the port conflict will happen.
public class TwilioAccessServiceTest {

  @Autowired
  private TwilioAccessService itemService;

  @Test()
  public void test() {
    String userIdentifier = "" + System.nanoTime();
    Assertions.assertDoesNotThrow(() -> itemService.createTwilioAccessInfo(userIdentifier));
  }
}
