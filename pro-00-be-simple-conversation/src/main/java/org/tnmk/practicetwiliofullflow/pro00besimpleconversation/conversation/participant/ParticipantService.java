package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.participant;

import com.twilio.rest.conversations.v1.conversation.Participant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParticipantService {
  public Participant joinConversation(String userIdentity, String conversationSid) {
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .create();
    return participant;
  }
}
