package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio;

import com.twilio.http.NetworkHttpClient;
import com.twilio.http.Request;
import com.twilio.http.Response;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MockNetworkHttpClient extends NetworkHttpClient {
  private final String host;

  public Response makeRequest(final Request request) {
    String realUrl = request.getUrl();
    String mockUrl = realUrl; // TODO
    Request mockRequest = new Request(request.getMethod(), mockUrl);
    return super.makeRequest(mockRequest);
  }
}
