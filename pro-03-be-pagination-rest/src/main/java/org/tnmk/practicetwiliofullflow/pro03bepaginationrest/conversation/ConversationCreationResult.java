package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Participant;

import java.util.List;

public class ConversationCreationResult {
  private Conversation conversation;
  private List<Participant> participants;

  public ConversationCreationResult() {
  }

  public ConversationCreationResult(Conversation conversation, List<Participant> participants) {
    this.conversation = conversation;
    this.participants = participants;
  }

  public void setConversation(Conversation conversation) {
    this.conversation = conversation;
  }

  public void setParticipants(List<Participant> participants) {
    this.participants = participants;
  }

  public Conversation getConversation() {
    return conversation;
  }

  public List<Participant> getParticipants() {
    return participants;
  }
}
