package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.create_conversation_with_participants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateConversationWithParticipantsRequestDto {
  private String uniqueName;
  private List<String> participantIdentities;
}
