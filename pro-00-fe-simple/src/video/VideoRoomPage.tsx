import React, {ChangeEvent, useEffect, useState} from "react";
import VideoRoomStarter from "./VideoRoomStarter";
import VideoRoomsList from "./VideoRoomsList";
import VideoRoomCall from "./VideoRoomCall";
import {Room} from "twilio-video";
import backendTwilioAccessClient from "../common/twilio/accesstoken/BackendTwilioAccessClient";
import twilioVideoClient from "../common/twilio/video/TwilioVideoClient";
import './VideoRoomPage.css';
import backendVideoClient from "../common/twilio/video/BackendVideoClient";
import VideoRoomBE from "../common/twilio/video/VideoRoomBE";

const createInitUsername = () => {
  let currentUserIdStr = localStorage.getItem('currentUserId');
  if (!currentUserIdStr) {
    currentUserIdStr = '0';
  }
  let nextUserId: number = (+currentUserIdStr) + 1;
  if (nextUserId >= 5) {
    nextUserId = 1;
  }
  localStorage.setItem('currentUserId', nextUserId.toString())
  return 'user' + nextUserId;
}

const VideoRoomPage = (): JSX.Element => {
  const [inputUsername, setInputUsername] = useState<string>(createInitUsername());
  const [inputRoomName, setInputRoomName] = useState<string>('room01');//We use the name 'inputRoomName' to distinguish with room.name
  const [room, setRoom] = useState<Room | undefined>();
  const [rooms, setRooms] = useState<Array<VideoRoomBE>>([]);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(()=> {
    backendVideoClient.findAllRooms().then(rooms => setRooms(rooms));
  },[room]);

  // Logic for VideoRoomStarter: Begin //////////////////////////////////////////////////////////////////
  const onStartVideoRoom = async () => {
    let existToken: string = accessToken || await backendTwilioAccessClient.createAccessToken(inputUsername);
    setAccessToken(existToken);
    const joinedRoom = await twilioVideoClient.joinOrStartRoom(existToken, inputRoomName);
    setRoom(joinedRoom);
    // NOTE: in onLeaveVideoCall(), we used `setRoom({...disconnectedRoom} as Room)`
    // But here, we have to use setRoom(joinedRoom)
    // because using `setRoom({...joinedRoom})` will make the `room` become a new object, hence it won't keep any Socket connection anymore.
    // Therefore, the call `room?.disconnect()` will fail because of no Socket connection.
  }

  const onLeaveVideoCall = async () => {
    const disconnectedRoom = room?.disconnect();
    setRoom(undefined);
    // setRoom({...disconnectedRoom} as Room);
    // Both `disconnectedRoom` and current `room` actually are referring to the same object memory.
    // Hence doing this `setRoom(disconnectedRoom)` won't make ReactJS rerender the new values inside joinedRoom.
    // So one way is using `setRoom({...disconnectedRoom} as Room);`
    // However, when doing that, room become a pure object and it won't have other methods such as `.on()` ...
    // So a better way is just setting null here, and child component should turn off video based on that.
  }

  const onChangeInputUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputUsername(event.target.value);
  }
  const onChangeInputRoomName = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputRoomName(event.target.value);
  }
  // Logic for VideoRoomStarter: End //////////////////////////////////////////////////////////////////


  return (
    <div className={'container'}>

      <VideoRoomStarter
        inputUsername={inputUsername}
        inputRoomName={inputRoomName}
        room={room}
        onChangeInputUsername={onChangeInputUsername}
        onChangeInputRoomName={onChangeInputRoomName}
        onStartVideoRoom={onStartVideoRoom}
        onLeaveVideoCall={onLeaveVideoCall}
      />

      {/*Body row: begin*/}
      <div className={'row bg-light'}>

        <div className={'col-9'}>
          {room && <VideoRoomCall room={room}/>}
        </div>

        <div className={'col-3 gx-0 rooms-panel'}>
          <VideoRoomsList rooms={rooms}/>
        </div>

      </div>
      {/*Body row: end*/}

    </div>
  );
};

export default VideoRoomPage;
