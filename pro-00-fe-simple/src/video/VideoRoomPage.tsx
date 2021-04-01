import React from "react";
import VideoRoomStarter from "./VideoRoomStarter";
import VideoRoomsList from "./VideoRoomsList";
import VideoRoomCall from "./VideoRoomCall";

const VideoRoomPage = (): JSX.Element => {

  return (
    <div className={'container'}>

      <VideoRoomStarter/>

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
