import BeUser from "../../common/twilio/conversation/BeUser";
import userHelper from "./UserHelper";
import CachedConversation from "../CachedConversation";

class PotentialConversationHelper {


  /**
   * We have to filter based on user identity, not user.sid because for the same user identity,
   * we can have different participantSids, and those participantSids also different from user.sid.
   *
   * Terminology:
   * Peer Conversation: this is the One-on-One Conversation
   *
   * Note: the localUserIdentity is corresponding to values in {@link CachedConversation.remoteParticipants}
   * And the implicit localParticipantIdentity ({@link CachedConversation.conversation.author}) in every item of existingConversations must be the same.
   */
  filterRemoteUsersNotInPeerConversations = (localUserIdentity: string, existingConversations: Array<CachedConversation>, allUsers: Array<BeUser>): Array<BeUser> => {
    const remoteUsers = userHelper.excludeUserIdentity(allUsers, localUserIdentity);
    const peerConversations = existingConversations.filter(item => item.remoteParticipants.length === 1);
    const potentialRemoteParticipants = this.excludeUsersThatExistInPeerConversations(remoteUsers, peerConversations);
    return potentialRemoteParticipants;
  };

  excludeUsersThatExistInPeerConversations = (users: Array<BeUser>, peerConversations: Array<CachedConversation>): Array<BeUser> => {
    const usersNotExistInPeerConversations = users.filter(user => !this.existInPeerConversation(user, peerConversations));
    return usersNotExistInPeerConversations;
  }

  existInPeerConversation = (user: BeUser, peerConversations: Array<CachedConversation>): boolean => {
    const conversationContainUser = peerConversations.find(cachedConversation => cachedConversation.remoteParticipants[0].identity === user.identity);
    const result = conversationContainUser ? true : false;
    return result;
  }
}

const potentialConversationHelper = new PotentialConversationHelper();
export default potentialConversationHelper;