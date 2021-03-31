package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess;

public class TwilioAccessInfo {
  private String accessToken;

  public TwilioAccessInfo(String accessToken) {
    this.accessToken = accessToken;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }
}
