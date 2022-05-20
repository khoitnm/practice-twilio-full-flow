package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.conversation;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.MessageCreator;
import com.twilio.rest.conversations.v1.conversation.MessageUpdater;
import com.twilio.rest.conversations.v1.conversation.Participant;
import com.twilio.rest.conversations.v1.user.UserConversation;
import com.twilio.rest.conversations.v1.user.UserConversationReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioErrorCode;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.utils.JsonUtils;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.MessageDto;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.MessageMapper;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.SendMessageRequest;
import org.tnmk.practicetwiliofullflow.pro00besimpleconversation.conversation.message.UpdateMessageRequest;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {
  private final TwilioProperties twilioProperties;

  public ConversationCreationResultDto createConversation(ConversationCreationRequest request) {
    Conversation conversation = createConversation(request.getUniqueName());
    List<Participant> participants = new ArrayList<>();
    for (String participantIdentity : request.getParticipantIdentities()) {
      Participant participant = joinConversation(participantIdentity, conversation.getSid());
      participants.add(participant);
    }
    return new ConversationCreationResultDto(conversation, participants);
  }

  public void deleteConversation(String conversationSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation.deleter(conversationSid).delete();
  }

  private Participant joinConversation(String userIdentity, String conversationSid) {
    return joinConversation(userIdentity, conversationSid, userIdentity);
  }

  private Participant joinConversation(String userIdentity, String conversationSid, String fullName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .create();
    return participant;
  }

  public List<UserConversation> findConversationsOfUser(String userIdentityOrUserSid) {
    try {
      List<UserConversation> result = new ArrayList<>();

      UserConversationReader reader = UserConversation.reader(userIdentityOrUserSid);
      Page<UserConversation> page = null;
      do {
        if (page == null) {
          page = reader.firstPage();
        } else {
          page = reader.nextPage(page);
        }
        result.addAll(page.getRecords());
      } while (page.hasNextPage());
      return result;
    } catch (ApiException ex) {
      if (TwilioErrorCode.CONVERSATION_NOT_FOUND_CODES.contains(ex.getCode())) {
        return new ArrayList<>();
      } else {
        throw ex;
      }
    }
  }

  private Conversation createConversation(String uniqueName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation conversation = Conversation.creator()
        .setUniqueName(uniqueName)
        .create();
    log.info("Created conversation {} with uniqueName {}", conversation.getSid(), uniqueName);
    return conversation;
  }

}
