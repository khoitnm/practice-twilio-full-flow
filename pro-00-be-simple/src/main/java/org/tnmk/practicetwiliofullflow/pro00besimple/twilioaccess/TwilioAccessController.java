package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TwilioAccessController {
  private final TwilioAccessService twilioAccessService;

  @Autowired
  public TwilioAccessController(TwilioAccessService twilioAccessService) {
    this.twilioAccessService = twilioAccessService;
  }

  @PostMapping("/twilio/access-info/{userIdentifier}")
  public TwilioAccessInfo createItem(@PathVariable("userIdentifier") String userIdentifier) {
    TwilioAccessInfo savedItem = twilioAccessService.createTwilioAccessInfo(userIdentifier);
    return savedItem;
  }
}
