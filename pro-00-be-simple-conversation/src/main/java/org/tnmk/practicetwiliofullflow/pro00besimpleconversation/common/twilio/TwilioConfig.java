package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio;

import com.twilio.Twilio;
import com.twilio.http.TwilioRestClient;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class TwilioConfig {
  private final TwilioProperties twilioProperties;

  TwilioConfig(TwilioProperties twilioProperties) {
    /**
     * The {@link Twilio#init(String, String)} and {@link Twilio#init(String, String, String)}  methods are quite confusing.
     * In those methods, username and password could have different meanings:
     * - username & password could be accountSid and authToken.
     * - Or username & password could also be apiKey and apiSecret
     *
     * This is the document when we login into Twilio console: https://www.twilio.com/console/video/project/api-keys
     * "API Keys are revokable credentials for the Twilio API.
     * You can use API Keys to authenticate to the REST API using basic auth
     * , with user=KeySid and password=KeySecret.
     *
     * And, you can use API Keys to sign Access Tokens,
     * which are used by Twilio's Real-Time Communications SDKs.
     * Access Tokens are short-lived credentials that can be distributed safely to client-side applications."
     *
     * ---------------------------
     * Conclusion:
     * So, in our case, we decide to use {ApiKey, ApiSecret, and AccountSid} instead of {AccountSid and AuthToken}
     * The reason is it's much safer with ApiKey & ApiSecret: https://www.twilio.com/blog/protect-phishing-auth-token-fraud
     */
    log.info("Initiate twilio with configurations: "
        + "\n\taccountSid: " + twilioProperties.getAccountSid()
        + "\n\tapiKey: " + twilioProperties.getApiKey()
        + "\n\tconversationServiceSid: " + twilioProperties.getConversationServiceSid());
    this.twilioProperties = twilioProperties;
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
  }

  @Bean
  public TwilioRestClient twilioRestClient(@Value("${twilio.mock-host:}") String mockHost) {
    if (StringUtils.isBlank(mockHost)) {
      return realTwilioRestClient();
    } else {
      return mockTwilioRestClient(mockHost);
    }
  }

  private TwilioRestClient realTwilioRestClient() {
    TwilioRestClient twilioRestClient = Twilio.getRestClient();
    Twilio.setRestClient(twilioRestClient);
    return twilioRestClient;
  }

  private TwilioRestClient mockTwilioRestClient(String mockHost) {
    MockNetworkHttpClient mockNetworkHttpClient = new MockNetworkHttpClient(mockHost);

    TwilioRestClient.Builder builder = new TwilioRestClient.Builder(twilioProperties.getApiKey(), twilioProperties.getApiSecret());
    TwilioRestClient twilioRestClient = builder.httpClient(mockNetworkHttpClient).build();
    Twilio.setRestClient(twilioRestClient);
    return twilioRestClient;
  }
}

