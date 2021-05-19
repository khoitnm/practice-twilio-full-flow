import React from "react";
import BeVideoRoom from "../common/twilio/video/BeVideoRoom";

export interface VideoRoomsListProps {
  rooms: Array<BeVideoRoom>
}

const VideoRoomsList = ({rooms}: VideoRoomsListProps): JSX.Element => {

  return (
    <>
      <div className={'pb-3 pt-3 room-items-header'}>
        Available Rooms
      </div>
      <div className={'pt-3 gx-3 room-items-list'}>
        {
          rooms.map((room) => (
            <button key={room.roomSid} className={'w-100 room-item'} title={room.uniqueName}>{room.uniqueName}</button>
          ))
        }
      </div>

    </>
  );
};

export default VideoRoomsList;
