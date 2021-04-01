import React from "react";

const styleVideoCall = {
  border: "1px solid #BBB",
  borderRadius: '5px',
  backgroundColor: "#DDD",
};

const VideoRoomCall = (): JSX.Element => {

  return (
    <div className={'rol'} style={styleVideoCall}>
      <div className={'col-6'}>
        Main user
        <video>

        </video>
      </div>
      <div className={'col-6'}>Participant user</div>
    </div>
  );
};

export default VideoRoomCall;
