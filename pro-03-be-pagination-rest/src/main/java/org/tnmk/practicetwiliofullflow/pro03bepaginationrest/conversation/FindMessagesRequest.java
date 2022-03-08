package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FindMessagesRequest {
  private String conversationSid;
}
