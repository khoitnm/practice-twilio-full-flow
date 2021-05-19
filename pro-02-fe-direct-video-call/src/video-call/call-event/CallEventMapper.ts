import {Message} from "@twilio/conversations/lib/message";
import CallEvent from "./CallEvent";
import BeUpdateMessageRequest from "../../common/twilio/conversation/BeUpdateMessageRequest";
import BeMessage from "../../common/twilio/conversation/BeMessage";
import CallMessageAttributes from "./CallMessageAttributes";
import CallMessageBody from "./CallMessageBody";

class CallEventMapper {
  toCallEventFromMessage = (message: Message) => {
    const messageAttributes: CallMessageAttributes = message.attributes as CallMessageAttributes;
    const messageBody: CallMessageBody = JSON.parse(message.body);
    const event: CallEvent = {
      conversationAuthorParticipantIdentity: message.author,
      conversationAuthorParticipantSid: message.participantSid,
      conversationSid: message.conversation.sid,
      messageAttributes: messageAttributes,
      messageBody: messageBody,
      messageSid: message.sid,
      roomSid: messageBody.room.sid,
      videoStartedParticipantIdentity: messageBody.room.startedParticipantIdentity,
      callStartedDate: message.dateCreated,
      eventDate: message.dateUpdated || message.dateCreated, //The message for call "Requested" event may not have "dateUpdated" because it's just created.
    };
    return event;
  }
  toCallEventFromBeMessage = (beMessage: BeMessage<any>): CallEvent => {
    const messageAttributes: CallMessageAttributes = beMessage.attributes;
    const messageBody: CallMessageBody = JSON.parse(beMessage.body);
    const event: CallEvent = {
      conversationAuthorParticipantIdentity: beMessage.author,
      conversationAuthorParticipantSid: beMessage.participantSid,
      conversationSid: beMessage.conversationSid,
      messageAttributes: messageAttributes,
      messageBody: messageBody,
      messageSid: beMessage.sid,
      roomSid: messageBody.room.sid,
      videoStartedParticipantIdentity: messageBody.room.startedParticipantIdentity,
      callStartedDate: beMessage.dateCreated,
      eventDate: beMessage.dateUpdated || beMessage.dateCreated, //The message for call "Requested" event may not have "dateUpdated" because it's just created.
    }
    return event;
  }

  toUpdateMessageRequest = (localParticipantIdentity: string, previousEvent: CallEvent, newEventType: string): BeUpdateMessageRequest<CallMessageAttributes> => {
    const messageAttributes: CallMessageAttributes = {
      eventType: newEventType
    }
    const request: BeUpdateMessageRequest<CallMessageAttributes> = {
      messageSid: previousEvent.messageSid,
      conversationSid: previousEvent.conversationSid,
      createdByUserIdentity: localParticipantIdentity,
      messageAttributes: messageAttributes,
      messageBody: undefined, //we don't need to change anything in messageBody
    }
    return request;
  }


}

const callEventMapper = new CallEventMapper();
export default callEventMapper;