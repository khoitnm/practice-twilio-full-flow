package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio;

import com.twilio.http.NetworkHttpClient;
import com.twilio.http.Request;
import com.twilio.http.Response;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.apache.http.client.utils.URIUtils;

import java.net.URI;
import java.net.URISyntaxException;

@RequiredArgsConstructor
public class MockNetworkHttpClient extends NetworkHttpClient {
  private final String host;

  public Response makeRequest(final Request request) {
    String realUrl = request.getUrl();
    URI realUri = null;
    HttpHost realHost = null;
    try {
      realUri = new URI(realUrl);
      realHost = URIUtils.extractHost(new URI(realUrl));
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException("Cannot extract host from url: " + realUrl);
    }

    String mockUrl = StringUtils.replace(realUrl, realHost.getHostName(), this.host);
    mockUrl = StringUtils.replace(mockUrl, realHost.getSchemeName(), "http");

    Request mockRequest = new Request(request.getMethod(), mockUrl);
    return super.makeRequest(mockRequest);
  }
}
