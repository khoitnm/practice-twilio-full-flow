package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // support Json converter
@AllArgsConstructor
public class ParticipantAttributes {
  private String fullName;
}
