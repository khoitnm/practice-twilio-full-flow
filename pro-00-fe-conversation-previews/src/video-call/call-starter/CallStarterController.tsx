import React, {useEffect, useState} from "react";
import CallStarterModal from "./CallStarterModal";
import {Room} from "twilio-video";
import CachedConversation from "../../conversation/CachedConversation";
import callEventHelper from "../call-event/CallEventHelper";
import CallEvent from "../call-event/CallEvent";
import beVideoService from "../../common/twilio/video/BeVideoService";
import twilioVideoService from "../../common/twilio/video/TwilioVideoService";
import twilioConversationClientFactory from "../../common/twilio/conversation/TwilioConversationClientFactory";
import Client from "@twilio/conversations";
import immutableMapHelper from "../../conversation/helper/ImmutableMapHelper";
import CallEventType from "../call-event/CallEventType";
import BeVideoRoom from "../../common/twilio/video/BeVideoRoom";


export interface CallStarterControllerProps {
  localUserIdentity: string,
  conversationClient: Client,
  cachedConversation: CachedConversation,
  waitingRoom?: BeVideoRoom,
  setWaitingRoom: (beVideoRoom?: BeVideoRoom) => void,
  room?: Room,
  setRoom: (room?: Room) => void,
}

const CallStarterController = ({
                                 waitingRoom,
                                 setWaitingRoom,
                                 room,
                                 setRoom,
                                 localUserIdentity,
                                 conversationClient,
                                 cachedConversation
                               }: CallStarterControllerProps): JSX.Element => {
  /**
   * Note: this callEvents is different from {@link VideoCallsReceiveController.callEvents} (?)
   * On another thought, it looks like we can reuse the same callEvents???
   *
   * key: roomSid (we can consider this as callSid)
   * value: latest important event for a Call.
   *
   * We need to store events of a list of Calls here because when we receive a response (accept/declined/canceled), we need to know which Call that event is replying to.
   */
  const [callStarterEvents, setCallStarterEvents] = useState<Map<string, CallEvent>>(new Map());
  /**
   * If the number of declines is the same as the number of remoteParticipants, it means the Call should be canceled.
   *
   * key: roomSid (we can consider this as callSid)
   * value: the number of declines in that call.
   */
  const [callDeclineCounts, setCallDeclineCounts] = useState<Map<string, number>>(new Map());
  /**
   * We may have to manage different Calls at the same time, but there's only one request Call at a time.
   * Hence we only need one variable to know whether we are requesting any Call or not.
   */
  const [isWaitingResponse, setIsWaitingResponse] = useState<boolean>(false);

  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    return () => {
      setCallStarterEvents(new Map());
      setAccessToken(undefined)
    }
  }, []);

  useEffect(() => {
    setIsWaitingResponse(callEventHelper.hasAnyRequestingCall(callStarterEvents));
    return () => setIsWaitingResponse(false);
  }, [callStarterEvents]);


  useEffect(() => {
    const listenCallDeclined = (event: CallEvent) => {
      //FIXME To prevent async problem with useState(), we may have to move this logic into setCallEvents(preState => {...});
      const preEvent = callStarterEvents.get(event.roomSid);
      if (preEvent) {
        if (callEventHelper.isOneOfTypes(preEvent, [CallEventType.CANCELED, CallEventType.ENDED, CallEventType.ACCEPTED])) {
          //TODO maybe we should check with the real Room status instead of just rely on the event state (Canceled / Ended) here.
          console.log(`The roomSid ${preEvent.roomSid} was either accepted or canceled/ended, hence we don't really care about the "Declined" event anymore: ${JSON.stringify(event.messageAttributes)}`);
        } else {
          setCallStarterEvents(prevState => new Map(prevState).set(event.roomSid, event));
          setCallDeclineCounts(prevState => immutableMapHelper.plusNumValueInMap(prevState, event.roomSid, 1));
        }
      } else {
        console.log(`There's no previous event for roomSid ${event.roomSid}, it means the Call was finished. Hence we won't care about this new "Declined" event anymore: ${JSON.stringify(event.messageAttributes)}`);
      }
    }

    const listenCallAccepted = async (event: CallEvent) => {
      const preEvent = callStarterEvents.get(event.roomSid);
      if (preEvent) {
        if (callEventHelper.isCallCanceledEvent(preEvent) || callEventHelper.isCalledEndedEvent(preEvent)) {
          console.log(`The roomSid ${preEvent.roomSid} was either canceled or ended, hence we don't really care about accepted event anymore: ${JSON.stringify(event.messageAttributes)}`);
        } else {
          //We only join the room after other participants accepted because if there's no one accepted it, we want that room empty,
          // hence it would be expired automatically after 5 mins.
          let callAccessToken = accessToken;
          if (!callAccessToken) {
            callAccessToken = await twilioConversationClientFactory.getAccessToken(localUserIdentity);
            setAccessToken(callAccessToken);
          }
          if (waitingRoom) {
            const joinedRoom = await twilioVideoService.joinVideoRoom(callAccessToken, waitingRoom.uniqueName);
            setRoom(joinedRoom);
            setWaitingRoom(undefined);
          } else {
            console.warn(`The room ${event.roomSid} was accepted, but cannot join any room because there's no waitingRoom.`);
          }
          setCallStarterEvents(prevState => new Map(prevState).set(event.roomSid, event));
        }
      } else {
        console.log(`There's no previous event for roomSid ${event.roomSid}, it means the Call was finished. Hence we won't care about this "Accepted" event anymore: ${event.messageAttributes}`);
      }
    }

    // Note: other modules can have different listeners on the same event onCallRequested/onCallCanceled
    callEventHelper.onCallDeclinedEvent(conversationClient, listenCallDeclined);
    callEventHelper.onCallAcceptedEvent(conversationClient, listenCallAccepted);
    return () => {
      callEventHelper.offCallDeclinedEvent(conversationClient, listenCallDeclined);
      callEventHelper.offCallAcceptedEvent(conversationClient, listenCallAccepted);
    }
  }, [setRoom, setWaitingRoom, waitingRoom, localUserIdentity, conversationClient, accessToken, callStarterEvents]);

  const onRequestCall = async () => {
    const roomUniqueName = `Room_${window.performance.now()}`;
    const accessToken = await twilioConversationClientFactory.getAccessToken(localUserIdentity);
    setAccessToken(accessToken);
    const beRoom = await beVideoService.createRoom(roomUniqueName);
    setWaitingRoom(beRoom);
    console.log(`Start the room ${beRoom.sid} (but not join yet)`);
    const callEvent = await callEventHelper.notifyCallRequested(localUserIdentity, cachedConversation.conversation, beRoom);
    setCallStarterEvents(prevState => new Map(prevState).set(callEvent.roomSid, callEvent));
    //TODO if the waiting time is expired (5mins, e.g) and there's no "accepted" response, then we should trigger "canceled" event.
  }

  /**
   * The method onCancelCall() is used as a dependency of a useEffect, hence we need to apply useCallback() here to reuse it.
   */
  const onCancelCall = async () => {
    if (!waitingRoom) {
      console.warn(`There's no requesting room that are waiting for responses. Hence we cannot cancel any requesting room.`);
      return;
    }
    const waitingCallEvent = callStarterEvents.get(waitingRoom.sid);
    if (!waitingCallEvent) {
      console.warn(`Cannot find any call event associated with waitingRoom ${waitingRoom.sid}, so we cannot cancel any requesting call.`)
      return;
    }
    room?.disconnect();
    setRoom(undefined);
    await beVideoService.endRoom(waitingCallEvent.roomSid);
    const callCanceledEvent = await callEventHelper.notifyCallCanceled(localUserIdentity, waitingCallEvent);
    setCallStarterEvents(prevState => new Map(prevState).set(callCanceledEvent.roomSid, callCanceledEvent));
    console.log(`The room ${callCanceledEvent.roomSid} will be canceled. Trigger cancel call ${callCanceledEvent.roomSid}`);
  };

  useEffect(() => {
    callDeclineCounts.forEach((callDeclineCount: number, roomSid: string) => {
      //use conversation remote participants instead of room's participants because room may don't have enough participants at this moment.
      const maxRemoteParticipants = cachedConversation.remoteParticipants.length;
      if (callDeclineCount >= maxRemoteParticipants) {
        const latestCallEventOfDeclinedRoom = callStarterEvents.get(roomSid);
        if (latestCallEventOfDeclinedRoom &&
          latestCallEventOfDeclinedRoom.roomSid === waitingRoom?.sid &&
          !callEventHelper.isOneOfTypes(latestCallEventOfDeclinedRoom, [CallEventType.CANCELED, CallEventType.ENDED, CallEventType.ACCEPTED])) {

          console.log(`All remote participants declined the call. So we're going to end this waiting call.\n Room: ${JSON.stringify(waitingRoom)}`);
          //Just let it run asynchronously.
          //TODO Hard to decide which "roomEnded" event should be the source of truth, the event from room or event from conversation?
          //  Then how should we handle if one of the event couldn't reach remote participants?

          beVideoService.endRoom(latestCallEventOfDeclinedRoom.roomSid).then(() => {
            console.log(`The room ${waitingRoom?.sid} is ended. Now we will notify "callEnded" event...`);
            callEventHelper.notifyCallEnded(localUserIdentity, latestCallEventOfDeclinedRoom).then(callEndedEvent => {
              // room?.disconnect();//May be not necessary anymore.
              setWaitingRoom(undefined);
              setRoom(undefined);
              setCallStarterEvents(prevState => new Map(prevState).set(callEndedEvent.roomSid, callEndedEvent));
              console.log(`The room ${waitingRoom?.sid} is disconnected because all remote participants declined it. Trigger ended call ${callEndedEvent.roomSid}`);
            });
          });
        } else {
          //Just ignore it, doesn't need to cancel the Call anymore.
        }
      }
    })
  }, [setRoom, setWaitingRoom, callDeclineCounts, callStarterEvents, cachedConversation.remoteParticipants.length, waitingRoom, localUserIdentity])

  return (
    <>
      <button className={'simple-button simple-button-dark'} onClick={onRequestCall}><i className="bi bi-camera-video"></i></button>
      {isWaitingResponse && <CallStarterModal cachedConversation={cachedConversation} onCallCancel={onCancelCall}/>}
    </>
  );
};
export default CallStarterController;