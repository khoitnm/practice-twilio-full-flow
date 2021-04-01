import React from "react";
import VideoRoomStarter from "./VideoRoomStarter";
import VideoRoomsList from "./VideoRoomsList";
import VideoRoomCall from "./VideoRoomCall";
import {Room} from "twilio-video";

const VideoRoomPage = (): JSX.Element => {
  let accessToken: string;
  let username: string;
  let room: Room;


  const callbackStartVideoCall = async (result: any) => {
    username = result.username;
    accessToken = result.accessToken;
    room = result.room;
  }

  return (
    <div className={'container'}>

      <VideoRoomStarter callbackStartVideoCall={callbackStartVideoCall}/>

      {/*Body row: begin*/}
      <div className={'row gx-5 mt-2'}>

        <div className={'col-9'}>
          <VideoRoomCall/>
        </div>

        <div className={'col-3'}>
          <VideoRoomsList/>
        </div>

      </div>
      {/*Body row: end*/}

    </div>
  );
};

export default VideoRoomPage;
