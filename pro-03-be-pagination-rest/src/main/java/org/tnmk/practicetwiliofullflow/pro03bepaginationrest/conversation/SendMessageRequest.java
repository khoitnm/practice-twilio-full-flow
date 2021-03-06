package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendMessageRequest {
  private String createdByUserIdentity;
  private String conversationSid;
  private String messageBody;
  private Map<String, String> messageAttributes;
}
