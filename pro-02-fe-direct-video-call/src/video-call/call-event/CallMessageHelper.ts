import {Message} from "@twilio/conversations/lib/message";
import CallMessageAttributes from "./CallMessageAttributes";
import CallEventType from "./CallEventType";


export class CallMessageHelper {

  isCallRequestedMessage = (message: Message): boolean => {
    return this.hasMessageType(message, CallEventType.REQUESTED);
  };
  isCallCanceledMessage = (message: Message): boolean => {
    return this.hasMessageType(message, CallEventType.CANCELED);
  };
  isCallDeclinedMessage = (message: Message): boolean => {
    return this.hasMessageType(message, CallEventType.DECLINED);
  };
  isCallAcceptedMessage = (message: Message): boolean => {
    return this.hasMessageType(message, CallEventType.ACCEPTED);
  };
  isCallEndedMessage = (message: Message): boolean => {
    return this.hasMessageType(message, CallEventType.ENDED);
  };

  hasMessageType = (message: Message, messageType: string) => {
    const callMessageAttribute = message.attributes as CallMessageAttributes;
    return callMessageAttribute?.eventType === messageType;
  }

  isCallMessage = (message?: Message): boolean => {
    if (!message) return false;
    //TODO we should have another attribute to distinguish "audioCall", "videoCall", "imageUpload", "videoUpload", "externalLink", "textMessage"
    const callMessageAttribute = message.attributes as CallMessageAttributes;
    return callMessageAttribute?.eventType ? true : false;
  }
}

const callMessageHelper = new CallMessageHelper();
export default callMessageHelper;