package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateConversationRequestDto {
  private String uniqueName;
}
