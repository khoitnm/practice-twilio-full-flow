package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver.conversation.user;

import com.twilio.rest.conversations.v1.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <b>Why do I put `User` domain inside `Conversation` domain?</b>
 * https://www.twilio.com/docs/chat/rest/user-resource#create-a-user-resource
 *
 * The 'User' concept is actually independent from 'Conversation'/'Chat'.
 * However, at this moment, I only have to create User resource when working with Conversation only.
 * For example, when working with Video, I don't need to creat any User resource.
 * The participantIdentifier could be create on the fly with any name.
 * But for Conversation, it doesn't work that way.
 * And looking at the document from twilio, handling User resource document is mentioned under `chat` service,
 * so it looks like they are coupling together.
 * Therefore, I put User domain inside Conversation for now.
 *
 * In the future, if other services also need to deal with User directly, then I'll move it out.
 */
@RestController
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/user/{userIdentifier}")
  public User createUser(@PathVariable("userIdentifier") String userIdentifier) {
    User user = userService.createUser(userIdentifier);
    return user;
  }

  @GetMapping("/users")
  public List<User> findFirstPageUsersInConversationService() {
    List<User> users = userService.findFirstPageUsersInConversationService();
    return users;
  }
}
