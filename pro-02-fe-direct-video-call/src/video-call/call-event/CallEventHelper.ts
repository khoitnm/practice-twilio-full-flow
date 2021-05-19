import CallEvent from "./CallEvent";
import Client from "@twilio/conversations";
import {Message} from "@twilio/conversations/lib/message";
import callEventMapper from "./CallEventMapper";
import beConversationService from "../../common/twilio/conversation/BeConversationService";
import BeSendMessageRequest from "../../common/twilio/conversation/BeSendMessageRequest";
import {Conversation} from "@twilio/conversations/lib/conversation";
import callMessageHelper from "./CallMessageHelper";
import CallMessageAttributes from "./CallMessageAttributes";
import CallEventType from "./CallEventType";
import CallMessageBody from "./CallMessageBody";
import arrayHelper from "../../common/util/ArrayHelper";
import UpdatedMessage from "../../conversation/helper/UpdatedMessage";
import BeVideoRoom from "../../common/twilio/video/BeVideoRoom";

/**
 * key: videoEventListener,
 * value: messageListener
 *
 * We have to store listeners instances into this map so that we can turn off the same instances when cleaning up resources.
 */
const listenersMap: Map<any, any> = new Map<any, any>();

/**
 * This class give an abstract layer for client codes to deal with {@link CallEvent}.
 * Behind the scene, this class will transform {@link CallEvent} to Conversation's {@link Message} with the help of {@link callMessageHelper}
 */
class CallEventHelper {
  /**
   * A Participant is in a Call or not (he's in a Call when we joined a VideoRoom)
   * And at that time, he may still receive a notification of another coming call,
   * but he shouldn't be interrupted by that call.
   *
   * @param callEvents Please read explanation in {@link VideoCallsReceiveController.callEvents}
   *
   * @deprecated Not used anymore. We actually should determine whethere we are being in a call based on the 'room' state.
   * If it has value, we are being in a call.
   * If not, then we are not being in any call.
   */
  isInCall = (callEvents: Map<string, CallEvent>): boolean => {
    for (const [roomSid, callEvent] of Object.entries(callEvents)) {
      if (callEventHelper.isCallAcceptedEvent(callEvent)) {
        console.info(`The user is being in call in room ${roomSid}`);
        return true;
      }
    }
    return false;
  }
  hasAnyRequestingCall = (callEvents: Map<string, CallEvent>): boolean => {
    const requestingCall = this.getRequestingCallEvent(callEvents);
    return requestingCall ? true : false;
  }
  getRequestingCallEvent = (callEvents: Map<string, CallEvent>): CallEvent | undefined => {
    const callEventItems = arrayHelper.toArray(callEvents.entries()) as Array<[string, CallEvent]>;
    for (const [roomSid, callEvent] of callEventItems) {
      if (callEventHelper.isCallRequestEvent(callEvent)) {
        console.info(`The user is requesting a call in room ${roomSid}`);
        return callEvent;
      }
    }
    return undefined;
  }

  notifyCallRequested = async (localParticipantIdentity: string, conversation: Conversation, waitingRoom: BeVideoRoom): Promise<CallEvent> => {
    const messageAttributes: CallMessageAttributes = {eventType: CallEventType.REQUESTED};
    const messageBody: CallMessageBody = {
      room: {
        startedParticipantIdentity: localParticipantIdentity,
        sid: waitingRoom.sid,
        uniqueName: waitingRoom.uniqueName
      }
    }
    const sendMessageRequest: BeSendMessageRequest = {
      conversationSid: conversation.sid,
      createdByUserIdentity: localParticipantIdentity,
      messageAttributes: messageAttributes,
      messageBody: JSON.stringify(messageBody)
    }
    const beMessage = await beConversationService.sendMessage(sendMessageRequest);
    return callEventMapper.toCallEventFromBeMessage(beMessage);
  }
  notifyCallEnded = async (localUserIdentity: string, previousCallEvent: CallEvent) => {
    const updateMessageRequest = callEventMapper.toUpdateMessageRequest(localUserIdentity, previousCallEvent, CallEventType.ENDED);
    const beMessage = await beConversationService.updateMessage(updateMessageRequest);
    return callEventMapper.toCallEventFromBeMessage(beMessage);
  }
  notifyCallCanceled = async (localUserIdentity: string, previousCallEvent: CallEvent) => {
    const updateMessageRequest = callEventMapper.toUpdateMessageRequest(localUserIdentity, previousCallEvent, CallEventType.CANCELED);
    const beMessage = await beConversationService.updateMessage(updateMessageRequest);
    return callEventMapper.toCallEventFromBeMessage(beMessage);
  }
  notifyCallDeclined = async (localUserIdentity: string, previousCallEvent: CallEvent) => {
    const updateMessageRequest = callEventMapper.toUpdateMessageRequest(localUserIdentity, previousCallEvent, CallEventType.DECLINED);
    const beMessage = await beConversationService.updateMessage(updateMessageRequest);
    return callEventMapper.toCallEventFromBeMessage(beMessage);
  }
  notifyCallAccepted = async (localUserIdentity: string, previousCallEvent: CallEvent) => {
    const updateMessageRequest = callEventMapper.toUpdateMessageRequest(localUserIdentity, previousCallEvent, CallEventType.ACCEPTED);
    const beMessage = await beConversationService.updateMessage(updateMessageRequest);
    return callEventMapper.toCallEventFromBeMessage(beMessage);
  }
  onCallRequestedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    const messageListener = (message: Message) => {
      if (callMessageHelper.isCallRequestedMessage(message)) {
        const event = callEventMapper.toCallEventFromMessage(message);
        eventListener(event);
      }
    }
    listenersMap.set(eventListener, messageListener);
    client.on("messageAdded", messageListener);
  }
  offCallRequestedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    this.offMessageListener(client, "messageAdded", eventListener);
  }

  onCallCanceledEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    const messageListener = (updatedMessage: UpdatedMessage) => {
      if (callMessageHelper.isCallCanceledMessage(updatedMessage.message)) {
        const event = callEventMapper.toCallEventFromMessage(updatedMessage.message);
        eventListener(event);
      }
    }
    listenersMap.set(eventListener, messageListener);
    client.on("messageUpdated", messageListener);
  }

  offCallCanceledEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    this.offMessageListener(client, "messageUpdated", eventListener);
  }

  onCallDeclinedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    const messageListener = (updatedMessage: UpdatedMessage) => {
      if (callMessageHelper.isCallDeclinedMessage(updatedMessage.message)) {
        const event = callEventMapper.toCallEventFromMessage(updatedMessage.message);
        eventListener(event);
      }
    }
    listenersMap.set(eventListener, messageListener);
    client.on("messageUpdated", messageListener);
  }
  offCallDeclinedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    this.offMessageListener(client, "messageUpdated", eventListener);
  }

  onCallAcceptedEvent(client: Client, eventListener: (event: CallEvent) => void) {
    const messageListener = (updatedMessage: UpdatedMessage) => {
      if (callMessageHelper.isCallAcceptedMessage(updatedMessage.message)) {
        const event = callEventMapper.toCallEventFromMessage(updatedMessage.message);
        eventListener(event);
      }
    }
    listenersMap.set(eventListener, messageListener);
    client.on("messageUpdated", messageListener);
  }

  offCallAcceptedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    this.offMessageListener(client, "messageUpdated", eventListener);
  }

  onCallEndedEvent(client: Client, eventListener: (event: CallEvent) => void) {
    const messageListener = (updatedMessage: UpdatedMessage) => {
      if (callMessageHelper.isCallEndedMessage(updatedMessage.message)) {
        const event = callEventMapper.toCallEventFromMessage(updatedMessage.message);
        eventListener(event);
      }
    }
    listenersMap.set(eventListener, messageListener);
    client.on("messageUpdated", messageListener);
  }

  offCallEndedEvent = (client: Client, eventListener: (event: CallEvent) => void) => {
    this.offMessageListener(client, "messageUpdated", eventListener);
  }


  /**
   * @param client Conversation Client
   * @param messageListenerType http://media.twiliocdn.com/sdk/js/conversations/releases/0.1.0/docs/Client.html
   * @param eventListener listener of VideoEvent
   */
  private offMessageListener = (client: Client, messageListenerType: string, eventListener: (event: CallEvent) => void) => {
    const messageListener = listenersMap.get(eventListener);
    if (messageListener) {
      client.off(messageListenerType, messageListener);
    } else {
      console.warn(`Cannot find the corresponding messageListener for ${eventListener}, hence cannot remove that messageListener from eventType '${messageListenerType}'`);
    }
  }

  isCallRequestEvent(callEvent?: CallEvent) {
    return callEvent?.messageAttributes.eventType === CallEventType.REQUESTED;
  }

  isCallCanceledEvent(callEvent?: CallEvent) {
    return callEvent?.messageAttributes.eventType === CallEventType.CANCELED;
  }

  isCallDeclinedEvent(callEvent?: CallEvent) {
    return callEvent?.messageAttributes.eventType === CallEventType.DECLINED;
  }


  isCalledEndedEvent(callEvent?: CallEvent) {
    return callEvent?.messageAttributes.eventType === CallEventType.ENDED;
  }

  isCallAcceptedEvent(callEvent?: CallEvent) {
    return callEvent?.messageAttributes.eventType === CallEventType.ACCEPTED;
  }


  /**
   * Check whether the callEvent's type satisfy one of criteriaTypes or not.
   * @param callEvent
   * @param criteriaTypes value come from {@link CallEventType}.
   */
  isOneOfTypes(callEvent?: CallEvent, criteriaTypes?: string[]) {
    const eventType = callEvent?.messageAttributes.eventType;
    if (!eventType || !criteriaTypes) return false;

    for (const criteriaType of criteriaTypes) {
      if (criteriaType === eventType) {
        return true;
      }
    }
    return false;
  }

  isCallStatus(callEvent?: CallEvent, callStatus?: string) {
    return callEvent?.messageAttributes.eventType === callStatus;
  }

  filterEventsByCallStatus = (callEvents: Map<string, CallEvent>, callStatus: string): Array<CallEvent> => {
    const result: Array<CallEvent> = [];
    callEvents.forEach((callEvent: CallEvent, roomSid: string) => {
      if (this.isCallStatus(callEvent, callStatus)) {
        result.push(callEvent);
      }
    });
    return result;
  }
}

const callEventHelper = new CallEventHelper();
export default callEventHelper;