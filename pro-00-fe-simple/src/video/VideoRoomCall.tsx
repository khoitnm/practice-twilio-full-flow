import React from "react";
import {Participant, Room} from "twilio-video";
import LocalParticipantVideo from "./LocalParticipantVideo";

const styleVideoCall = {
  border: "1px solid #BBB",
  borderRadius: '5px',
  backgroundColor: "#DDD",
};

export interface VideoRoomCallProps {
  room: Room
}

const VideoRoomCall = ({room}: VideoRoomCallProps): JSX.Element => {

  return (
    <div className={'rol'} style={styleVideoCall}>
      <div className={'col-6'}>
        <LocalParticipantVideo participant={room.localParticipant}/>
      </div>
      <div className={'col-6'}>Participants user
        {JSON.stringify(room.participants)}
      </div>
    </div>
  );
};

export default VideoRoomCall;
