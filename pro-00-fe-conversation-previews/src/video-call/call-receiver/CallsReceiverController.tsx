import React, {useEffect, useState} from "react";
import '../Modal.css';
import Client from "@twilio/conversations";
import CallsReceiverModal from "./CallsReceiverModal";
import callEventHelper from "../call-event/CallEventHelper";
import CallEvent from "../call-event/CallEvent";
import twilioConversationClientFactory from "../../common/twilio/conversation/TwilioConversationClientFactory";
import twilioVideoService from "../../common/twilio/video/TwilioVideoService";
import {Room} from "twilio-video";
import CachedConversation from "../../conversation/CachedConversation";
import twilioConversationService from "../../common/twilio/conversation/TwilioConversationService";
import conversationHelper from "../../conversation/helper/ConversationHelper";
import CallEventType from "../call-event/CallEventType";

export interface CallsReceiverControllerProps {
  localParticipantIdentity: string,
  conversationClient: Client,

  cachedConversation?: CachedConversation,
  setConversation: (cachedConversation: CachedConversation) => void,
  room?: Room,
  setRoom: (room: Room) => void,
}

const CallsReceiverController = ({
                                   localParticipantIdentity,
                                   conversationClient,
                                   cachedConversation,
                                   setConversation,
                                   room,
                                   setRoom
                                 }: CallsReceiverControllerProps): JSX.Element => {
  /**
   * Each item represent a Call.
   * A Call may have multiple Events (StartCall, DeclineCalls (by A, B, C, etc.), AcceptCalls (by D, E, F, etc.), EndCall.
   * However, in this case, we only store the most important Events that help us to know whether the Call is started, is on going, or is stopped.
   *
   * The key: is the id of the Call, which is roomSid
   * The value: is the latest important Event of the Call
   *
   * For example:
   * - CallRequested (by A) => save this Event into an item of the state
   * - CallDeclined (by B)  => save this Event into the same item of the state (replace the first Event)
   * - CallAccepted (by C)  => when there's any Accepted response, the Call will be started
   * - CallDeclined (by D)  => when the Call is started (Accepted by one person), we don't care about other Declined responses anymore,
   *                           hence we don't save this Event into the state.
   * - CallEnded (by A)     => when the Call is Ended, we don't care about any other Accepted or Declined response anymore
   *                           hence this is the last Event we'll save into this item of the state.
   * - CallAccepted/Declined (by E) => don't care anymore!!!
   */
  const [callReceiverEvents, setCallReceiverEvents] = useState<Map<string, CallEvent>>(new Map());
  const [hasAnyRequestingCall, setHasAnyRequestingCall] = useState<boolean>(false);
  useEffect(() => {
    const hasRequestingCall = callEventHelper.hasAnyRequestingCall(callReceiverEvents);
    setHasAnyRequestingCall(hasRequestingCall);
    return () => {
      setHasAnyRequestingCall(false);
    }
  }, [callReceiverEvents])

  useEffect(() => {
    const listenCallRequested = (event: CallEvent) => {
      if (event.conversationAuthorParticipantIdentity === localParticipantIdentity) {
        //When this user is the author of the call request, he doesn't need to response that request.
        return;
      }
      setCallReceiverEvents(prevState => new Map(prevState).set(event.roomSid, event));
    }
    const listenCallCanceled = (event: CallEvent) => {
      if (event.conversationAuthorParticipantIdentity === localParticipantIdentity) {
        console.debug(`Don't need to handle "Canceled": ${JSON.stringify(event)} event sent by himself: ${localParticipantIdentity}`)
        return;
      }

      const preEvent = callReceiverEvents.get(event.roomSid);
      if (preEvent) {
        if (callEventHelper.isCalledEndedEvent(preEvent)) {
          //TODO maybe we should check with the real Room status instead of just rely on the event state here.
          console.log(`The roomSid ${preEvent.roomSid} was ended, hence we don't really care about canceled event anymore: ${JSON.stringify(event.messageAttributes)}`);
        } else {
          console.log(`Listen: call ${event.roomSid} is canceled.`);
          setCallReceiverEvents(prevState => new Map(prevState).set(event.roomSid, event));
        }
      } else {
        console.log(`There's no previous event for roomSid ${event.roomSid}, it means the Call was finished. Hence we won't care about this "Canceled" event anymore ${JSON.stringify(event.messageAttributes)}`);
      }
    }
    const listenCallEnded = (event: CallEvent) => {
      if (event.conversationAuthorParticipantIdentity === localParticipantIdentity) {
        //When this user is the author of the call request, he doesn't need to response that request.
        return;
      }

      //FIXME To prevent async problem with useState(), we may have to move this logic into setCallEvents(preState => {...});
      const preEvent = callReceiverEvents.get(event.roomSid);
      if (preEvent) {
        console.log(`Listen: call ${event.roomSid} is ended.`);
        setCallReceiverEvents(prevState => new Map(prevState).set(event.roomSid, event));
      } else {
        console.log(`There's no previous event for roomSid ${event.roomSid}, it means the Call was finished. Hence we won't care about this "Ended" event anymore ${JSON.stringify(event.messageAttributes)}`);
      }
    }
    // Note: other modules can have different listeners on the same event onCallRequested/onCallCanceled
    // We don't really care about Accepted response from other receiver.
    callEventHelper.onCallRequestedEvent(conversationClient, listenCallRequested);
    callEventHelper.onCallCanceledEvent(conversationClient, listenCallCanceled);
    callEventHelper.onCallEndedEvent(conversationClient, listenCallEnded);
    return () => {
      callEventHelper.offCallRequestedEvent(conversationClient, listenCallRequested);
      callEventHelper.offCallCanceledEvent(conversationClient, listenCallCanceled);
      callEventHelper.offCallEndedEvent(conversationClient, listenCallEnded);
    }
  }, [localParticipantIdentity, conversationClient, callReceiverEvents]);

  const onDeclineCallback = async (callRequestedEvent: CallEvent) => {
    // Just ignore the VideoRoom and don't join it.
    const declinedEvent = await callEventHelper.notifyCallDeclined(localParticipantIdentity, callRequestedEvent);
    setCallReceiverEvents(prevState => new Map(prevState).set(declinedEvent.roomSid, declinedEvent));
    console.log(`Trigger declinedEvent: ${JSON.stringify(declinedEvent)}`);
  }
  const onAcceptCallback = async (callRequestedEvent: CallEvent) => {
    try {
      const accessToken = await twilioConversationClientFactory.getAccessToken(localParticipantIdentity);
      const joinedRoom = await twilioVideoService.joinVideoRoom(accessToken, callRequestedEvent.messageBody.room.uniqueName);
      setRoom(joinedRoom);

      //When a person join a room, he also switch the conversation.
      const conversation = await twilioConversationService.getConversationBySid(localParticipantIdentity, callRequestedEvent.conversationSid);
      const cachedConversation = await conversationHelper.toCachedConversation(localParticipantIdentity, conversation);
      setConversation(cachedConversation);

      await declineOtherRequestedEvents(callRequestedEvent.roomSid);

      const acceptedEvent = await callEventHelper.notifyCallAccepted(localParticipantIdentity, callRequestedEvent);
      setCallReceiverEvents(prevState => new Map(prevState).set(acceptedEvent.roomSid, acceptedEvent));
      console.log(`Trigger acceptedEvent: ${JSON.stringify(acceptedEvent)}`);
    } catch (error) {
      const message = `Cannot join the room: ${callRequestedEvent.roomSid}. Root cause: ${error.message}`;
      alert(message);
      console.error(message, error);
    }
  }

  /**
   * Decline all of other events from other roomSid that have callStatus "Requested".
   * @param excludedRoomSid
   */
  const declineOtherRequestedEvents = async (excludedRoomSid: string) => {
    const allRequestedEvents: Array<CallEvent> = callEventHelper.filterEventsByCallStatus(callReceiverEvents, CallEventType.REQUESTED);
    const otherRequestedEvents = allRequestedEvents.filter(event => event.roomSid !== excludedRoomSid);
    for (let otherRequestedEvent of otherRequestedEvents) {
      callEventHelper.notifyCallDeclined(localParticipantIdentity, otherRequestedEvent).then(declinedEvent => {
        setCallReceiverEvents(prevState => new Map(prevState).set(declinedEvent.roomSid, declinedEvent));
      });
    }
  };

  // TODO If it's inCall and then there's another coming callEvents, we'll show notification in a different way.
  //  For now, I just don't show any coming call notification when this user is being in a call.
  return (
    <>
      {!room && hasAnyRequestingCall &&
      <CallsReceiverModal callEvents={callReceiverEvents} onDeclineCallback={onDeclineCallback} onAcceptCallback={onAcceptCallback}/>}
    </>
  );
};
export default CallsReceiverController;