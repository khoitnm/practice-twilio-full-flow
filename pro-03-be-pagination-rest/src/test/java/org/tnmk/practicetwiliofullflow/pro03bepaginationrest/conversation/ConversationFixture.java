package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.testinfra.UniqueTestData;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationFixture {

  private final UserService userService;
  private final ConversationService conversationService;

  public ConversationCreationResult randomConversationWithParticipants(int usersCount) {
    List<String> userIdentities = new ArrayList<>();
    for (int i = 0; i < usersCount; i++) {
      userIdentities.add("user" + System.nanoTime());
    }
    ConversationCreationRequest conversationCreationRequest = new ConversationCreationRequest(
        "conversation" + System.nanoTime(),
        "conversation display name" + UniqueTestData.uniqueInt(),
        userIdentities);

    ConversationCreationResult result = conversationService.createConversation(conversationCreationRequest);
    return result;
  }

  public void cleanUpConversationAndUsers(ConversationCreationResult createdResult) {
    createdResult.getParticipants().parallelStream()
        .forEach(participant -> userService.deleteUser(participant.getIdentity()));
    conversationService.deleteConversation(createdResult.getConversation().getSid());
  }
}
