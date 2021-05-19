// This interface is used to define the structure for this messageUpdated event.
//  We have to define this interface because at this moment, Twilio SDK doesn't provide any specific type for this
// http://media.twiliocdn.com/sdk/js/conversations/releases/0.1.0/docs/Client.html#event:messageUpdated
import {Message} from "@twilio/conversations/lib/message";
import {User} from "@twilio/conversations";
import UpdateReason = User.UpdateReason;

export default interface UpdatedMessage {
  message: Message,
  updateReasons: Array<UpdateReason>
}