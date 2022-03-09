package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.rest.conversations.v1.conversation.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class MessageFixture {
  private final ConversationService conversationService;

  public List<Message> createMessages(String conversationSid, String authorIdentity, int messagesCount) {
    List<Message> result = IntStream.range(0, messagesCount)
        .parallel()
        .mapToObj(i -> randomMessage(conversationSid, authorIdentity))
        .collect(Collectors.toList());
    return result;
  }

  private Message randomMessage(String conversationSid, String authorIdentity) {
    SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
        .conversationSid(conversationSid)
        .createdByUserIdentity(authorIdentity)
        .messageAttributes(null)
        .messageBody("message body " + System.nanoTime())
        .build();
    return conversationService.sendMessage(sendMessageRequest);
  }

}