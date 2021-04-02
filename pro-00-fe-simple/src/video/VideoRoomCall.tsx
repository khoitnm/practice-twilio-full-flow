import React, {useEffect, useState} from "react";
import {Participant, Room} from "twilio-video";
import LocalParticipantVideo from "./LocalParticipantVideo";
import RemoteParticipantVideo from "./RemoteParticipantVideo";
import './VideoRoomCall.css';

export interface VideoRoomCallProps {
  room?: Room
}

const VideoRoomCall = ({room}: VideoRoomCallProps): JSX.Element => {
  const [remoteParticipants, setRemoteParticipants] = useState<Array<Participant>>([]);

  useEffect(() => {
    const onParticipantConnected = (participant: Participant) => {
      console.log(`participant ${participant.identity} have just joined.`);
      setRemoteParticipants((prevParticipants: Array<Participant>) => [...prevParticipants, participant]);
    };

    const onParticipantDisconnected = (disconnectedParticipant: Participant) => {
      console.log(`participant ${disconnectedParticipant.identity} left.`);
      setRemoteParticipants((prevParticipants: Array<Participant>) =>
        prevParticipants.filter((p) => p !== disconnectedParticipant)
      );
    };

    //We are creating listeners, and those listener shouldn be created only one time when the component is initiated only.
    //Listeners shouldn't be register multiple times, that's why we put it in this useEffect();
    room?.on("participantConnected", onParticipantConnected);
    room?.on("participantDisconnected", onParticipantDisconnected);
    // room.participants.forEach(participantConnected);
    return () => {
      room?.off("participantConnected", onParticipantConnected);
      room?.off("participantDisconnected", onParticipantDisconnected);
    };
  }, [room]);


  const remoteParticipantsComponent = remoteParticipants.map((participant) => (
    <RemoteParticipantVideo key={participant.sid} participant={participant}/>
  ));

  return (
    <div className={'row video-call-space p-3'}>
      <div className={'col-6 local-participant'}>
        { room && <LocalParticipantVideo key={room?.localParticipant.sid} participant={room.localParticipant}/>}
      </div>
      <div className={'col-6 remote-participant'}>
        {remoteParticipantsComponent}
        Remote Participants: {JSON.stringify(room?.participants)}<p/>
      </div>
    </div>
  );
};

export default VideoRoomCall;
