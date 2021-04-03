import React, {useEffect, useState} from "react";
import {Participant, Room} from "twilio-video";
import ParticipantVideo from "./ParticipantVideo";
import arrayHelper from "../common/util/ArrayHelper";

export interface VideoRoomCallProps {
  room?: Room
}

const VideoRoomCall = ({room}: VideoRoomCallProps): JSX.Element => {
    const [remoteParticipants, setRemoteParticipants] = useState<Array<Participant>>(arrayHelper.toDefinedArray(room?.participants.values()));
    const [localParticipantMute, setLocalParticipantMute] = useState<boolean>(true);

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


    const remoteParticipantsComponent = remoteParticipants.map((participant) => (
      <div className={'col-3 '}>
        <ParticipantVideo key={participant.sid} participant={participant}/>
      </div>
    ));

    const onMuteControl = () => {
      setLocalParticipantMute(!localParticipantMute);
    }

    return (
      <>
        <div className={'row local-participant pb-3'}>
          <div className={'col-12'}>
            {room && <ParticipantVideo key={room?.localParticipant.sid} participant={room.localParticipant} mute={localParticipantMute}/>}
          </div>
          <div className={'col-12  pt-3'}>
            <button className={'local-participant-controller-button'} onClick={onMuteControl}>
              <i hidden={!localParticipantMute} className="bi bi-mic"></i>
              <i hidden={localParticipantMute} className="bi bi-mic-mute"></i>
            </button>
          </div>
        </div>

        <div className={'row remote-participants pt-3'}>
          {remoteParticipantsComponent}
          {room?.participants.size && room?.participants.size > 0 && <>
              <div className={'col-3'}>
                  <div className={'participant'}>
                      <div className={'participant-name'}>User02</div>
                      <video autoPlay={true} className={'participant-video'}/>
                  </div>
              </div>
              <div className={'col-3'}>
                  <div className={'participant'}>
                      <div className={'participant-name'}>User03</div>
                      <video autoPlay={true} className={'participant-video'}/>
                  </div>
              </div>
              <div className={'col-3'}>
                  <div className={'participant'}>
                      <div className={'participant-name'}>User04</div>
                      <video autoPlay={true} className={'participant-video'}/>
                  </div>
              </div>
          </>
          }

        </div>
      </>
    );
  }
;

export default VideoRoomCall;
