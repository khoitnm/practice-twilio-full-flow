package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.common.twilio.mockclient;

import com.twilio.rest.Domains;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Getter
public class MockTwilioPathMapping {
  /**
   * This is the map between the Twilio domain ({@link Domains} and the prefix in URL path to mock server.
   * For example:
   * Domain 'conversations' will be mapped to path prefix 'twilio_conversations'. So:
   * 	- originalUrl: https://conversations.twilio.com/xxx
   * 	- mockUrl: http://localhost:8001/twilio_conversations/xxx
   */
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
