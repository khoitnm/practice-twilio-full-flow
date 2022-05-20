package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.twilio;

import java.util.Arrays;
import java.util.List;

/**
 * View more at https://www.twilio.com/docs/api/errors
 */
public interface TwilioErrorCode {
  /**
   * @deprecated By document of Twilio https://www.twilio.com/docs/api/errors,
   * message chat not found has error code 50500.
   * But when testing, if a message doesn't exist when deleting,
   * it throw error code {@link #MESSAGE_NOT_FOUND_WHEN_DELETING}
   */
  @Deprecated
  int MESSAGE_NOT_FOUND = 50500;
  int MESSAGE_NOT_FOUND_WHEN_DELETING = 20404;

  int USER_NOT_FOUND_WHEN_DELETING = 20404;
  int USER_NOT_FOUND_WHEN_UPDATING = 20404;
  int USER_NOT_FOUND_WHEN_FINDING = 20404;

  /**
   * After some investigation, it looks like something inconsistent here when the Conversation doesn't exist.
   * Sometimes Twilio SDK throws 20404, some other times it throws 50351
   */
  List<Integer> CONVERSATION_NOT_FOUND_CODES = Arrays.asList(20404, 50351);
  int CONVERSATION_NOT_FOUND_WHEN_FINDING = 20404;
  int CONVERSATION_NOT_FOUND_WHEN_DELETING = 50351;
  int CONVERSATION_PARTICIPANT_NOT_FOUND = 20404;
  int CONVERSATION_PARTICIPANT_ALREADY_EXISTS = 50433;
}
