import React, {ChangeEvent, useEffect, useState} from "react";
import VideoRoomStarter from "./VideoRoomStarter";
import VideoRoomsList from "./VideoRoomsList";
import VideoRoomCall from "./VideoRoomCall";
import {Room} from "twilio-video";
import beTwilioAccessService from "../common/twilio/accesstoken/BeTwilioAccessService";
import twilioVideoClient from "../common/twilio/video/TwilioVideoService";
import './css/VideoRoomPage.css';
import beVideoService from "../common/twilio/video/BeVideoService";
import BeVideoRoom from "../common/twilio/video/BeVideoRoom";
import {TwilioError} from "twilio-video/tsdef/TwilioError";

const CODE_ROOM_END = 53118;
const CODE_RECONNECT_FAIL__EXPIRE_ACCESS_TOKEN = 20104;
const CODE_RECONNECT_FAIL__ATTEMPTS_EXHAUST = 53000;
const CODE_RECONNECT_FAIL__TOO_LONG = 53204;

const createInitUsername = () => {
  let currentUserIdStr = localStorage.getItem('currentUserId');
  if (!currentUserIdStr) {
    currentUserIdStr = '0';
  }
  let nextUserId: number = (+currentUserIdStr) + 1;
  if (nextUserId > 3) {
    nextUserId = 1;
  }
  localStorage.setItem('currentUserId', nextUserId.toString())
  return 'user' + nextUserId;
}

const VideoRoomPage = (): JSX.Element => {
  const [inputUsername, setInputUsername] = useState<string>(createInitUsername());
  const [inputRoomName, setInputRoomName] = useState<string>('room01');//We use the name 'inputRoomName' to distinguish with room.name
  const [room, setRoom] = useState<Room | undefined>();
  const [rooms, setRooms] = useState<Array<BeVideoRoom>>([]);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    beVideoService.findAllRooms().then(rooms => setRooms(rooms));
  }, [room]);

  useEffect(() => {
    const onRoomEnd = (room: Room, error: TwilioError) => {
      if (!error || error.code === CODE_ROOM_END) {
        alert(`Room ${room.name} is ended.`)
        setRoom(undefined);
      } else if (error.code === CODE_RECONNECT_FAIL__EXPIRE_ACCESS_TOKEN) {
        alert('Signaling reconnection failed due to expired AccessToken!');
      } else if (error.code === CODE_RECONNECT_FAIL__ATTEMPTS_EXHAUST) {
        alert('Signaling reconnection attempts exhausted!');
      } else if (error.code === CODE_RECONNECT_FAIL__TOO_LONG) {
        alert('Signaling reconnection took too long!');
      } else {
        alert(`Room ${room.name} is ended unexpected. Error: ${JSON.stringify(error)}`)
      }

      console.log(`Room ${room.name} ended: ${JSON.stringify(error, null, 2)}`);// pretty print.
    };
    const closeRoomResources = () => {
      if (room) {
        room.disconnect();
        setRoom(undefined);
      }
    };
    //We are creating listeners, and those listener should be created only one time when the component is initiated only.
    //Listeners shouldn't be register multiple times, that's why we put it in this useEffect();
    room?.on("disconnected", onRoomEnd);

    // Follow this recommendation: https://www.twilio.com/docs/video/reconnection-states-and-events
    window.addEventListener("pagehide", closeRoomResources);
    window.addEventListener("beforeunload", closeRoomResources);
    return () => {
      window.removeEventListener("pagehide", closeRoomResources);
      window.removeEventListener("beforeunload", closeRoomResources);
      //Don't remove all listeners because other listeners could be subscribed by other React Components.
      room?.off("disconnected", onRoomEnd);
    };
  }, [room]);

  // Logic for VideoRoomStarter: Begin //////////////////////////////////////////////////////////////////
  const onStartVideoRoom = async () => {
    //Have to reuse accessToken to avoid conflict with other connecting accessToken.
    //TODO need to recheck whether the current accessToken is expired or not.
    let existToken: string = accessToken || await beTwilioAccessService.createAccessToken(inputUsername);
    setAccessToken(existToken);
    const joinedRoom = await twilioVideoClient.joinOrStartRoom(existToken, inputRoomName);
    setRoom(joinedRoom);
    // NOTE: in onLeaveVideoCall(), we used `setRoom({...disconnectedRoom} as Room)`
    // But here, we have to use setRoom(joinedRoom)
    // because using `setRoom({...joinedRoom})` will make the `room` become a new object, hence it won't keep any Socket connection anymore.
    // Therefore, the call `room?.disconnect()` will fail because of no Socket connection.
  }

  const onLeaveVideoCall = async () => {
    room?.disconnect();
    setRoom(undefined);
    // setRoom({...disconnectedRoom} as Room);
    // Both `disconnectedRoom` and current `room` actually are referring to the same object memory.
    // Hence doing this `setRoom(disconnectedRoom)` won't make ReactJS rerender the new values inside joinedRoom.
    // So one way is using `setRoom({...disconnectedRoom} as Room);`
    // However, when doing that, room become a pure object and it won't have other methods such as `.on()` ...
    // So a better way is just setting null here, and child component should turn off video based on that.
  }
  const onEndVideoCall = async () => {
    if (!room) {
      return;
    }
    await beVideoService.endRoom(room.sid);
  }

  const onChangeInputUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputUsername(event.target.value);
    setAccessToken(undefined);
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
        onEndVideoCall={onEndVideoCall}
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
