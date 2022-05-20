package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message;

import com.twilio.rest.conversations.v1.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.ConversationWithParticipantsService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.CreateConversationWithParticipantsRequestDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.create_conversation_with_participants.CreateConversationWithParticipantsResultDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.user.UserService;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.testinfra.BaseIntegrationTest;

import java.util.Arrays;

@ActiveProfiles("test")
public class SendMessageServiceTest extends BaseIntegrationTest {

  @Autowired
  private ConversationWithParticipantsService conversationWithParticipantsService;

  @Autowired
  private MessageService messageService;

  @Autowired
  private UserService userService;

  @Test()
  public void whenCreateAConversation_returnAConversationResult() {
    User user01 = userService.createUser("user" + System.nanoTime());
    User user02 = userService.createUser("user" + System.nanoTime());
    CreateConversationWithParticipantsRequestDto conversationCreationRequest = new CreateConversationWithParticipantsRequestDto(
        "conversation" + System.nanoTime(),
        Arrays.asList(user01.getIdentity(), user02.getIdentity()));

    CreateConversationWithParticipantsResultDto conversationCreationResult = conversationWithParticipantsService.createConversationWithParticipants(conversationCreationRequest);

    SendMessageRequest sendMessageRequest = new SendMessageRequest();
    sendMessageRequest.setConversationSid(conversationCreationResult.getConversation().getSid());
    sendMessageRequest.setCreatedByUserIdentity(user01.getIdentity());
    sendMessageRequest.setMessageBody("TestMessageBody");

    MessageDto messageResult = messageService.sendMessage(sendMessageRequest);

  }
}
