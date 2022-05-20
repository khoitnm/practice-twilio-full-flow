package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.participant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;

@Service
@RequiredArgsConstructor
public class TwilioParticipantService {
  private final TwilioProperties twilioProperties;

}
