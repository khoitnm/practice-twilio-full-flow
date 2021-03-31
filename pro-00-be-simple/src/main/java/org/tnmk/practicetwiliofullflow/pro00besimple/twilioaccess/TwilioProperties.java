package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "twilio")
public class TwilioProperties {
  private String accountSid;
  private String apiKey;
  private String apiSecret;
  private String serviceSid;

  public String getAccountSid() {
    return accountSid;
  }

  public void setAccountSid(String accountSid) {
    this.accountSid = accountSid;
  }

  public String getApiKey() {
    return apiKey;
  }

  public void setApiKey(String apiKey) {
    this.apiKey = apiKey;
  }

  public String getApiSecret() {
    return apiSecret;
  }

  public void setApiSecret(String apiSecret) {
    this.apiSecret = apiSecret;
  }

  public String getServiceSid() {
    return serviceSid;
  }

  public void setServiceSid(String serviceSid) {
    this.serviceSid = serviceSid;
  }
}