package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants;

import com.twilio.Twilio;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationService;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationWithParticipantsService {
  private final TwilioProperties twilioProperties;

  private final ConversationService conversationService;

  public CreateConversationWithParticipantsResultDto createConversationWithParticipants(CreateConversationWithParticipantsRequestDto request) {
    Conversation conversation = conversationService.createConversation(request.getUniqueName());
    List<Participant> participants = new ArrayList<>();
    for (String participantIdentity : request.getParticipantIdentities()) {
      Participant participant = joinConversation(participantIdentity, conversation.getSid());
      participants.add(participant);
    }
    return new CreateConversationWithParticipantsResultDto(conversation, participants);
  }

  public void deleteConversation(String conversationSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation.deleter(conversationSid).delete();
  }

  private Participant joinConversation(String userIdentity, String conversationSid) {
    return joinConversation(userIdentity, conversationSid, userIdentity);
  }

  private Participant joinConversation(String userIdentity, String conversationSid, String fullName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .create();
    return participant;
  }
}
