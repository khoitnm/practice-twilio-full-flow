package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationFixture {

  private final ConversationService conversationService;

  public ConversationCreationResult randomConversationWithParticipants(int usersCount) {
    List<String> userIdentities = new ArrayList<>();
    for (int i = 0; i < usersCount; i++) {
      userIdentities.add("user" + System.nanoTime());
    }
    ConversationCreationRequest conversationCreationRequest = new ConversationCreationRequest(
        "conversation" + System.nanoTime(),
        "conversation display name" + System.nanoTime(),
        userIdentities);

    ConversationCreationResult result = conversationService.createConversation(conversationCreationRequest);
    return result;
  }
}
