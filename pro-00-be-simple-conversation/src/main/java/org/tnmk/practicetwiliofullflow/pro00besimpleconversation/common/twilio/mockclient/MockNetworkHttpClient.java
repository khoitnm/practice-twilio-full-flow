package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.mockclient;

import com.twilio.http.NetworkHttpClient;
import com.twilio.http.Request;
import com.twilio.http.Response;
import com.twilio.rest.Domains;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.apache.http.client.utils.URIUtils;

import java.net.URI;
import java.net.URISyntaxException;

@Slf4j
@RequiredArgsConstructor
public class MockNetworkHttpClient extends NetworkHttpClient {
  private final String host;

  private final MockTwilioPathMapping mockTwilioPathMapping;

  public Response makeRequest(final Request request) {
    String realUrl = request.getUrl();
    String mockUrl = replaceHost(realUrl, "http", this.host);
    Request mockRequest = new Request(request.getMethod(), mockUrl);
    return super.makeRequest(mockRequest);
  }

  private String replaceHost(String originalUrl, String newSchema, String newHost) {
    URI realUri;
    HttpHost originalHost;
    try {
      realUri = new URI(originalUrl);
      originalHost = URIUtils.extractHost(realUri);
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException("Cannot extract host from url: " + originalUrl);
    }

    String newPathPrefix = getNewPathPrefix(originalHost);
    String newUrl = StringUtils.replace(originalUrl, originalHost.getSchemeName() + "://", newSchema + "://");
    newUrl = StringUtils.replace(newUrl, originalHost.getHostName(), newHost + "/" + newPathPrefix);
    log.info("Mock Twilio: \n"
        + "\toriginalUrl: {}\n"
        + "\tmockUrl: {}", originalUrl, newUrl);
    return newUrl;
  }

  private String getNewPathPrefix(HttpHost originalHost) {
    String[] oriHostParts = originalHost.toHostString().split("\\.");
    String twilioDomainStr = oriHostParts[0];
    Domains twilioDomain = findDomainsByName(twilioDomainStr);
    String pathPrefix = mockTwilioPathMapping.getPathPrefixMapByDomain().get(twilioDomain);
    if (pathPrefix == null) {
      throw new UnsupportedOperationException("Cannot found any pathPrefix with twilio domain " + twilioDomain);
    }
    return pathPrefix;
  }

  public Domains findDomainsByName(String domainName) {
    for (Domains domain : Domains.values()) {
      if (domain.name().equalsIgnoreCase(domainName)) {
        return domain;
      }
    }
    throw new UnsupportedOperationException("Cannot find any Domains enum with value '" + domainName + "'");
  }
}
