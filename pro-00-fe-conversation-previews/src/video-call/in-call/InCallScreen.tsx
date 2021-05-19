import React, {useEffect, useState} from "react";
import {Participant, Room} from "twilio-video";
import InCallParticipantV1 from "./media-track-option-1/InCallParticipantV1";
import CachedConversation from "../../conversation/CachedConversation";
import arrayHelper from "../../common/util/ArrayHelper";
import "./InCallScreen.css";
import beVideoService from "../../common/twilio/video/BeVideoService";

export interface InCallScreenProps {
  cachedConversation: CachedConversation,
  room: Room,
  setRoom: (room?: Room) => void,
}

const InCallScreen = ({cachedConversation, room, setRoom}: InCallScreenProps): JSX.Element => {
    const [remoteParticipants, setRemoteParticipants] = useState<Array<Participant>>(arrayHelper.toDefinedArray(room?.participants.values()));

    useEffect(() => {
      const onParticipantConnected = (participant: Participant) => {
        console.log(`participant ${participant.identity} have just joined.`);
        setRemoteParticipants((prevParticipants: Array<Participant>) => [...prevParticipants, participant]);
      };

      const onParticipantDisconnected = (disconnectedParticipant: Participant) => {
        console.log(`participant ${disconnectedParticipant.identity} left.`);
        setRemoteParticipants((prevParticipants: Array<Participant>) =>
          arrayHelper.newArrayExcludeItem(disconnectedParticipant, prevParticipants)
        );
      };

      //We are creating listeners, and those listener should be created only one time when the component is initiated only.
      //Listeners shouldn't be register multiple times, that's why we put it in this useEffect();
      room?.on("participantConnected", onParticipantConnected);
      room?.on("participantDisconnected", onParticipantDisconnected);
      // room.participants.forEach(participantConnected);
      return () => {
        //Don't remove all listeners because other listeners could be subscribed by other React Components.
        room?.off("participantConnected", onParticipantConnected);
        room?.off("participantDisconnected", onParticipantDisconnected);
      };
    }, [room]);


    const onLeaveVideoCall = async () => {
      room.disconnect();
      setRoom(undefined);
      // setRoom({...disconnectedRoom} as Room);
      // Both `disconnectedRoom` and current `room` actually are referring to the same object memory.
      // Hence doing this `setRoom(disconnectedRoom)` won't make ReactJS rerender the new values inside joinedRoom.
      // So one way is using `setRoom({...disconnectedRoom} as Room);`
      // However, when doing that, room become a pure object and it won't have other methods such as `.on()` ...
      // So a better way is just setting null here, and child component should turn off video based on that.
    }
    const onEndVideoCall = async () => {
      await beVideoService.endRoom(room.sid);
      //TODO we may want to notify in the conversation (message update) that the call is ended.
      //  In that case, we have to move the senderCallEvents and receiverCallEvents to the parent component.
    }

    const remoteParticipantsComponent = remoteParticipants.map((participant) => (
      <InCallParticipantV1 key={participant.sid} participant={participant}/>
    ));

    return (
      <>
        <div className={'row in-call-controller py-2'}>
          <div className={'col-12'}>
            <button onClick={onLeaveVideoCall} className={'simple-sibling-button simple-button-dark'}>Leave Call</button>
            <button onClick={onEndVideoCall} className={'simple-sibling-button simple-button-alert'}>End Call</button>
          </div>
        </div>
        <div className={'row'}>
          <div className={'col-sm-6 local-participant '}>
            {/*{room && <InCallParticipantV2 key={room?.localParticipant.sid} participant={room.localParticipant} isLocalParticipant={true}/>}*/}
            {room && <InCallParticipantV1 key={room?.localParticipant.sid} participant={room.localParticipant} isLocalParticipant={true}/>}
          </div>
          <div className={'col-sm-6 remote-participants'}>
            {remoteParticipantsComponent}
          </div>
        </div>
      </>
    );
  }
;

export default InCallScreen;
