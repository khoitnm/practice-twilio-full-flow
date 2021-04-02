import React from "react";


const VideoRoomsList = (): JSX.Element => {

  return (
    <>
      <div className={'pb-3 pt-3 room-items-header'}>
        Available Rooms
      </div>
      <div className={'pt-3 gx-3 room-items-list'}>
        <button className={'w-100 room-item'} title={'Room01 Sid SRxxxxxxxxxxxxxxx'}>Room01</button>
        <button className={'w-100 room-item'} title={'Room02 Sid SRxxxxxxxxxxxxxxx'}>Room02</button>
        <button className={'w-100 room-item'} title={'Room03 Sid SRxxxxxxxxxxxxxxx'}>Room03</button>
      </div>

    </>
  );
};

export default VideoRoomsList;
