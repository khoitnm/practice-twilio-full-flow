package org.tnmk.practicetwiliofullflow.pro00besimple.conversation;

import java.util.List;

public class ConversationCreationRequest {
  private String uniqueName;
  private List<String> participantIdentities;

  public ConversationCreationRequest() {
  }

  public ConversationCreationRequest(String uniqueName, List<String> participantIdentities) {
    this.uniqueName = uniqueName;
    this.participantIdentities = participantIdentities;
  }

  public String getUniqueName() {
    return uniqueName;
  }

  public void setUniqueName(String uniqueName) {
    this.uniqueName = uniqueName;
  }

  public void setParticipantIdentities(List<String> participantIdentities) {
    this.participantIdentities = participantIdentities;
  }

  public List<String> getParticipantIdentities() {
    return participantIdentities;
  }
}
