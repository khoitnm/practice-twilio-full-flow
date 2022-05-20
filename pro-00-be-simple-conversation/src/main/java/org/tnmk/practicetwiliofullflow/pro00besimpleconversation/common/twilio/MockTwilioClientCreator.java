package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio;

import com.twilio.http.HttpClient;
import com.twilio.http.NetworkHttpClient;
import com.twilio.http.TwilioRestClient;

public class MockTwilioClientCreator {
  public TwilioRestClient createMockRestClient(TwilioProperties twilioProperties, String host) {
    HttpClient twilioHttpClient = new MockNetworkHttpClient(host);

    TwilioRestClient.Builder builder = new TwilioRestClient.Builder(twilioProperties.getApiKey(), twilioProperties.getApiSecret());

    return builder.httpClient(twilioHttpClient).build();
  }
}
