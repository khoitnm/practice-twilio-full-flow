package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TwilioPageSdkDto {
  @JsonProperty("meta")
  private final TwilioPageMetaSdkDto meta;

  // The response from Twilio actually has another field to store a list of items (for example: `messages`, or `users`, or `conversations`).
  // However, at this moment, we don't really care about that field, so we won't put it here.
}
