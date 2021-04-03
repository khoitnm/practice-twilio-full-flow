import React from "react";
import {Room} from "twilio-video";
import ParticipantVideo from "./ParticipantVideo";
import VideoRoomBE from "../common/twilio/video/VideoRoomBE";

export interface VideoRoomsListProps {
  rooms: Array<VideoRoomBE>
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

        {/*<button className={'w-100 room-item'} title={'Room02 Sid SRxxxxxxxxxxxxxxx'}>Room02</button>*/}
        {/*<button className={'w-100 room-item'} title={'Room03 Sid SRxxxxxxxxxxxxxxx'}>Room03</button>*/}
      </div>

    </>
  );
};

export default VideoRoomsList;
