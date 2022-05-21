package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.mockclient;

import com.twilio.rest.Domains;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Getter
public class MockTwilioPathMapping {
  private final Map<Domains, String> pathPrefixMapByDomain = Collections.unmodifiableMap(createPathPrefixMapByDomain());

  /**
   * key: twilio domain: {@link Domains}
   * value: the path prefix of Twilio mock URL
   */
  private Map<Domains, String> createPathPrefixMapByDomain() {
    Map<Domains, String> result = new HashMap<>();
    result.put(Domains.API, "twilio_accounts");
    result.put(Domains.ACCOUNTS, "twilio_accounts");
    result.put(Domains.CONVERSATIONS, "twilio_conversations");
    result.put(Domains.CHAT, "twilio_chat");
    return result;
  }

}
