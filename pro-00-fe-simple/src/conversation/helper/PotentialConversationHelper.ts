import {Conversation} from "@twilio/conversations/lib/conversation";
import BeUser from "../../common/twilio/conversation/BeUser";
import userHelper from "./UserHelper";
import {Participant} from "@twilio/conversations/lib/participant";

class PotentialConversationHelper {
  /**
   * We have to filter based on user identity, not user.sid because for the same user identity,
   * we can have different participantSids, and those participantSids also different from user.sid.
   *
   * Terminology:
   * Peer Conversation: this is the One-on-One Conversation
   */
  filterRemoteUsersNotInPeerConversations = async (localUserIdentity: string, existingConversations: Array<Conversation>, allUsers: Array<BeUser>): Promise<Array<BeUser>> => {
    const remoteUsers = userHelper.excludeUserIdentity(allUsers, localUserIdentity);
    const potentialRemoteParticipants = await this.excludePeerRemoteParticipantsInConversations(localUserIdentity, existingConversations, remoteUsers);
    return potentialRemoteParticipants;
  };

  private excludePeerRemoteParticipantsInConversations = async (localUserIdentity: string, existingConversations: Array<Conversation>, users: Array<BeUser>): Promise<Array<BeUser>> => {
    const existingPeerRemoteParticipants: Set<string> = await this.getPeerRemoteParticipantIdentities(localUserIdentity, existingConversations);
    const potentialRemoteParticipants = users.filter(user => {
      return !existingPeerRemoteParticipants.has(user.identity)
    })
    return potentialRemoteParticipants;
  }

  private getPeerRemoteParticipantIdentities = async (localUserIdentity: string, conversations: Array<Conversation>): Promise<Set<string>> => {
    // promises from all conversations.
    // each conversation will have a list of Participants
    const promises: Array<Promise<Array<Participant>>> = [];
    for (let conversation of conversations) {
      promises.push(conversation.getParticipants());
    }
    const participantsInConversations = await Promise.all(promises);

    const peerParticipantIdentities: Array<string> = [];
    for (let participantsPerConversation of participantsInConversations) {
      const peerRemoteParticipant = this.getPeerRemoteParticipant(localUserIdentity, participantsPerConversation);
      if (peerRemoteParticipant) {
        peerParticipantIdentities.push(peerRemoteParticipant.identity);
      }
    }
    const result: Set<string> = new Set(peerParticipantIdentities);
    return result;
  }

  private getPeerRemoteParticipant = (localUserIdentity: string, participantsInConversation: Array<Participant>): Participant | undefined => {
    if (participantsInConversation.length !== 2) return undefined;
    if (participantsInConversation[0].identity === localUserIdentity) {
      return participantsInConversation[1];
    } else if (participantsInConversation[1].identity === localUserIdentity) {
      return participantsInConversation[0];
    } else {
      return undefined;
    }
  }
}

const potentialConversationHelper = new PotentialConversationHelper();
export default potentialConversationHelper;