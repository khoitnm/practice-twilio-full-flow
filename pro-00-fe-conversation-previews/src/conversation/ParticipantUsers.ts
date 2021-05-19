import {Participant} from "@twilio/conversations/lib/participant";
import {User} from "@twilio/conversations";

export default interface ParticipantUsers {
  participants: Participant[];
  users: User[];
}