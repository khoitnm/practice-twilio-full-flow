package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants;

import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateConversationWithParticipantsResultDto {
  private Conversation conversation;
  private List<Participant> participants;
}
