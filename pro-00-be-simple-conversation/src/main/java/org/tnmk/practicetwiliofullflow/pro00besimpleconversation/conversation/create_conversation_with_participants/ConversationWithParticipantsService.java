package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants;

import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation.ConversationService;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationWithParticipantsService {
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

  private Participant joinConversation(String userIdentity, String conversationSid) {
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .create();
    return participant;
  }
}
