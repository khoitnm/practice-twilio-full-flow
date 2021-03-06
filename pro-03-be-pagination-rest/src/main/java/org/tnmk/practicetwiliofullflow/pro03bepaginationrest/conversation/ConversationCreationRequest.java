package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConversationCreationRequest {
  private String uniqueName;
  private String displayName;
  private List<String> participantIdentities;
}
