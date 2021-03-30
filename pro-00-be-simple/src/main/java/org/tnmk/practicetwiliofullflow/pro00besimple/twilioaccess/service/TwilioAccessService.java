package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.service;

import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.ChatGrant;
import com.twilio.jwt.accesstoken.Grant;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.jwt.accesstoken.VoiceGrant;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.config.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess.model.TwilioAccessInfo;

import java.util.Arrays;
import java.util.List;

@Service
public class TwilioAccessService {

  private final TwilioProperties twilioProperties;

  private final List<Grant> defaultGrants;

  public TwilioAccessService(TwilioProperties twilioProperties) {
    this.twilioProperties = twilioProperties;
    this.defaultGrants = getDefaultGrants(twilioProperties.getServiceSid());
  }

  /**
   * @param userId
   * @return all necessary information for client app to call Twilio requests
   * @see TwilioAccessInfo
   */
  public TwilioAccessInfo createTwilioAccessInfo(String userId) {
    AccessToken token = new AccessToken.Builder(
        twilioProperties.getAccountSid(),
        twilioProperties.getApiKey(),
        twilioProperties.getApiSecret()
    ).identity(userId).grants(defaultGrants).build();
    return new TwilioAccessInfo(token.toJwt());
  }

  /**
   * TODO At this moment, we only provide ChatGrant.
   *   In the future, we may provide more grants such as {@link VideoGrant}, {@link VoiceGrant}.
   */
  private List<Grant> getDefaultGrants(String serviceSid) {
    ChatGrant chatGrant = new ChatGrant();
    chatGrant.setServiceSid(serviceSid);

    VideoGrant videoGrant = new VideoGrant();

    VoiceGrant voiceGrant = new VoiceGrant();
    return Arrays.asList(chatGrant, videoGrant, voiceGrant);
  }
}
