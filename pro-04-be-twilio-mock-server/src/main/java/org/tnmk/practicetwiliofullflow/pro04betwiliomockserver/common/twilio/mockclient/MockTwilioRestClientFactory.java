package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.common.twilio.mockclient;

import com.twilio.http.TwilioRestClient;

public class MockTwilioRestClientFactory {
  public static TwilioRestClient create(String apiKey, String apiSecret, String mockHost, MockTwilioPathMapping mockTwilioPathMapping) {
    MockNetworkHttpClient mockNetworkHttpClient = new MockNetworkHttpClient(mockHost, mockTwilioPathMapping);
    TwilioRestClient.Builder builder = new TwilioRestClient.Builder(apiKey, apiSecret);
    TwilioRestClient twilioRestClient = builder.httpClient(mockNetworkHttpClient).build();
    return twilioRestClient;
  }
}
