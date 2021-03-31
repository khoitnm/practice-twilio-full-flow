import {Conversation} from "@twilio/conversations/lib/conversation";
import {Paginator} from "@twilio/conversations/lib/interfaces/paginator";
import {Message} from "@twilio/conversations/lib/message";
import twilioClientFactory from "../TwilioClientFactory";
import {Participant, Room} from "twilio-video";
import backendVideoClient from "./BackendVideoClient";
import Video from "twilio-video";
import authenticationService from "../../../login/AuthenticationService";

/**
 * Guideline:
 * https://www.twilio.com/docs/conversations/sdk-download-install
 * https://www.npmjs.com/package/@twilio/conversations
 */
const twilioConversationClient = {

  /**
   * the participantIdentifier must have an existing User in Twilio.
   * If there's no corresponding user, it will throw an error.
   * @param mainUserIdentifier
   * @param targetParticipantIdentifier
   */
  startVideoRoomOneOnOne: async (targetParticipantIdentifier: string): Promise<Room> => {
    const authenticatedUser = authenticationService.validateAuthenticated();

    const videoRoom = await backendVideoClient.createRoom();

    const room: Room = await Video.connect(authenticatedUser.twilioAccessToken, {name: videoRoom.uniqueName});
    return room;
  },


}
export default twilioConversationClient;