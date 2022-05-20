package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // support Json converter
@AllArgsConstructor
public class ConversationAttributes {
  private String displayName;
}
