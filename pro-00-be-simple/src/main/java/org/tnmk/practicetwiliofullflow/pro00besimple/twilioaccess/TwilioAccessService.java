package org.tnmk.practicetwiliofullflow.pro00besimple.twilioaccess;

import com.twilio.jwt.accesstoken.AccessToken;
import com.twilio.jwt.accesstoken.ChatGrant;
import com.twilio.jwt.accesstoken.Grant;
import com.twilio.jwt.accesstoken.VideoGrant;
import com.twilio.jwt.accesstoken.VoiceGrant;
import com.twilio.rest.conversations.v1.User;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimple.conversation.UserService;

import java.util.Arrays;
import java.util.List;

@Service
public class TwilioAccessService {

  private final TwilioProperties twilioProperties;

  private final List<Grant> defaultGrants;

  private final UserService userService;

  public TwilioAccessService(TwilioProperties twilioProperties, UserService userService) {
    this.twilioProperties = twilioProperties;
    this.defaultGrants = getDefaultGrants(twilioProperties.getConversationServiceSid());
    this.userService = userService;
  }

  /**
   * @param userIdentity
   * @return all necessary information for client app to call Twilio requests
   * @see TwilioAccessInfo
   */
  public TwilioAccessInfo createTwilioAccessInfo(String userIdentity) {
//    User user = userService.getUser(userIdentity);
//    if (user == null) {
//      userService.createUser(userIdentity);
//    }

    AccessToken token = new AccessToken.Builder(
        twilioProperties.getAccountSid(),
        twilioProperties.getApiKey(),
        twilioProperties.getApiSecret()
    ).identity(userIdentity).grants(defaultGrants).build();
    return new TwilioAccessInfo(token.toJwt());
  }

  /**
   * TODO At this moment, we only provide ChatGrant.
   *   In the future, we may provide more grants such as {@link VideoGrant}, {@link VoiceGrant}.
   */
  private List<Grant> getDefaultGrants(String conversationServiceSid) {
    ChatGrant chatGrant = new ChatGrant();
    chatGrant.setServiceSid(conversationServiceSid);

    VideoGrant videoGrant = new VideoGrant();

    VoiceGrant voiceGrant = new VoiceGrant();
    return Arrays.asList(chatGrant, videoGrant, voiceGrant);
  }
}
