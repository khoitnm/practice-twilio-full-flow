package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.twilio.Twilio;
import com.twilio.base.Page;
import com.twilio.base.Reader;
import com.twilio.exception.ApiException;
import com.twilio.rest.conversations.v1.Conversation;
import com.twilio.rest.conversations.v1.conversation.Message;
import com.twilio.rest.conversations.v1.conversation.MessageCreator;
import com.twilio.rest.conversations.v1.conversation.MessageDeleter;
import com.twilio.rest.conversations.v1.conversation.MessageUpdater;
import com.twilio.rest.conversations.v1.conversation.Participant;
import com.twilio.rest.conversations.v1.user.UserConversation;
import com.twilio.rest.conversations.v1.user.UserConversationReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.common.twilio.TwilioErrorCode;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.common.twilio.TwilioProperties;
import org.tnmk.practicetwiliofullflow.pro03bepaginationrest.common.utils.JsonUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationService {
  // When having itemIndex, we can just ignore the pageIndex.
  private static final String MESSAGE_URL_PATTERN_WITH_ITEM_INDEX = "https://conversations.twilio.com/v1/Conversations/:conversationSid/Messages?PageSize=:pageSize&PageToken=PT:messageIndex";
  private static final String MESSAGE_URL_PATTERN_WITH_PAGE_INDEX = "https://conversations.twilio.com/v1/Conversations/:conversationSid/Messages?PageSize=:pageSize&Page=:pageIndex";
  private static final int DEFAULT_PAGE_SIZE = 50;
  private final TwilioProperties twilioProperties;

  public ConversationCreationResult createConversation(ConversationCreationRequest request) {
    Conversation conversation = createConversation(request.getUniqueName(), request.getDisplayName());
    List<Participant> participants = request.getParticipantIdentities().parallelStream()
        .map(participantIdentity -> joinConversation(participantIdentity, conversation.getSid()))
        .collect(Collectors.toList());
    return new ConversationCreationResult(conversation, participants);
  }

  public void deleteConversation(String conversationSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    Conversation.deleter(conversationSid).delete();
    log.info("Deleted conversation {}", conversationSid);
  }

  private Participant joinConversation(String userIdentity, String conversationSid) {
    return joinConversation(userIdentity, conversationSid, userIdentity);
  }

  private Participant joinConversation(String userIdentity, String conversationSid, String fullName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    ParticipantAttributes attributes = new ParticipantAttributes(fullName);
    String attributesJson = JsonUtils.toJsonString(attributes);
    Participant participant = Participant.creator(conversationSid)
        .setIdentity(userIdentity)
        .setAttributes(attributesJson)
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

  private Conversation createConversation(String uniqueName, String displayName) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    ConversationAttributes attributes = new ConversationAttributes(displayName);
    String attributesJson = JsonUtils.toJsonString(attributes);
    Conversation conversation = Conversation.creator()
        .setUniqueName(uniqueName)
        .setAttributes(attributesJson)
        .create();
    log.info("Created conversation {} with uniqueName {}", conversation.getSid(), uniqueName);
    return conversation;
  }

  public Message sendMessage(SendMessageRequest sendMessageRequest) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());

    MessageCreator messageCreator = Message.creator(sendMessageRequest.getConversationSid())
        .setAuthor(sendMessageRequest.getCreatedByUserIdentity())
        .setBody(sendMessageRequest.getMessageBody());
    if (!StringUtils.isEmpty(sendMessageRequest)) {
      messageCreator.setAttributes(JsonUtils.toJsonString(sendMessageRequest.getMessageAttributes()));
    }
    return messageCreator.create();
  }

  public MessageDto updateMessage(UpdateMessageRequest request) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    MessageUpdater updater = Message.updater(request.getConversationSid(), request.getMessageSid());
    if (!StringUtils.isEmpty(request.getMessageBody())) {
      updater.setBody(request.getMessageBody());
    }
    if (request.getMessageAttributes() != null && !request.getMessageAttributes().isEmpty()) {
      updater.setAttributes(JsonUtils.toJsonString(request.getMessageAttributes()));
    }
    Message message = updater.update();
    return MessageMapper.toMessageResult(message);
  }

  public Page<Message> findMessagesWithMessageIndex(String conversationSid, @Nullable Integer pageSize, @Nullable Integer messageIndex) {
    Reader<Message> messageReader = Message.reader(conversationSid).pageSize(pageSize);
    if (messageIndex == null || messageIndex == 0) {
      Page<Message> page = messageReader.firstPage();
      return page;
    } else {
      String targetPageUrl = formatUrlForFindMessagesWithMessageIndex(conversationSid, pageSize, messageIndex);
      return messageReader.getPage(targetPageUrl);
    }
  }

  private String formatUrlForFindMessagesWithMessageIndex(String conversationSid, Integer pageSize, Integer messageIndex) {
    if (pageSize == null) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
    String url = MESSAGE_URL_PATTERN_WITH_ITEM_INDEX;
    url = url.replace(":conversationSid", conversationSid);
    url = url.replace(":pageSize", String.valueOf(pageSize));
    url = url.replace(":messageIndex", String.valueOf(messageIndex));
    return url;
  }

  private String formatUrlForFindMessagesWithPageIndex(String conversationSid, Integer pageSize, Integer pageIndex) {
    if (pageSize == null) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
    String url = MESSAGE_URL_PATTERN_WITH_ITEM_INDEX;
    url = url.replace(":conversationSid", conversationSid);
    url = url.replace(":pageSize", String.valueOf(pageSize));
    url = url.replace(":pageIndex", String.valueOf(pageIndex));
    return url;
  }


  public boolean deleteMessage(String conversationSid, String messageSid) {
    Twilio.init(twilioProperties.getApiKey(), twilioProperties.getApiSecret(), twilioProperties.getAccountSid());
    MessageDeleter messageDeleter = Message.deleter(conversationSid, messageSid);
    log.info("[{}] message is deleted from ConversationSid {}", messageSid, conversationSid);
    return messageDeleter.delete();
  }
}
