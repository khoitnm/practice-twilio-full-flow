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
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
public class MockNetworkHttpClient extends NetworkHttpClient {
  private final String host;

  private static final Map<String, String> pathPrefixMapByTwilioDomain = new HashMap<>();

  public Response makeRequest(final Request request) {
    String realUrl = request.getUrl();
    String mockUrl = replaceHost(realUrl, "http", this.host);
    Request mockRequest = new Request(request.getMethod(), mockUrl);
    return super.makeRequest(mockRequest);
  }

  private static String replaceHost(String originalUrl, String newSchema, String newHost) {
    URI realUri;
    HttpHost originalHost;
    try {
      realUri = new URI(originalUrl);
      originalHost = URIUtils.extractHost(realUri);
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException("Cannot extract host from url: " + originalUrl);
    }
    String[] oriHostParts = originalHost.toHostString().split("\\.");
    String twilioDomain = oriHostParts[0];

    String newUrl = StringUtils.replace(originalUrl, originalHost.getSchemeName() + "://", newSchema + "://");
    newUrl = StringUtils.replace(newUrl, originalHost.getHostName(), newHost);
    return newUrl;
  }
}
