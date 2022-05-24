package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants;

import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation.ConversationService;
import org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.participant.ParticipantService;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationWithParticipantsService {
  private final ConversationService conversationService;
  private final ParticipantService participantService;
  public CreateConversationWithParticipantsResultDto createConversationWithParticipants(CreateConversationWithParticipantsRequestDto request) {
    Conversation conversation = conversationService.createConversation(request.getUniqueName());
    List<Participant> participants = new ArrayList<>();
    for (String participantIdentity : request.getParticipantIdentities()) {
      Participant participant = participantService.joinConversation(participantIdentity, conversation.getSid());
      participants.add(participant);
    }
    return new CreateConversationWithParticipantsResultDto(conversation, participants);
  }


}
