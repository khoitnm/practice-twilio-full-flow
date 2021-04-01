import React, {useState} from "react";
import {Room} from "twilio-video";
import backendTwilioAccessClient from "../common/twilio/accesstoken/BackendTwilioAccessClient";
import twilioVideoClient from "../common/twilio/video/TwilioVideoClient";

const ERROR_STATUS_ROOM_EXIST = 409;

enum VideoStatus {
  NONE, CONNECTED, DISCONNECTED
}

export interface VideoRoomStarterProps {
  callbackStartVideoCall: (result: any) => void;
};

const VideoRoomStarter = (props: VideoRoomStarterProps): JSX.Element => {
  const [inputUsername, setInputUsername] = useState<string>('user01');
  const [inputRoomName, setInputRoomName] = useState<string>('room01');//We use the name 'inputRoomName' to distinguish with room.name
  const [room, setRoom] = useState<Room>();
  const [accessToken, setAccessToken] = useState<string>();
  const [joinStatus, setJoinStatus] = useState<VideoStatus>(VideoStatus.NONE);//whether joined Video Room or not.

  const isJoinedVideo = () => {
    return joinStatus === VideoStatus.CONNECTED;
  }

  const onStartVideoRoom = async () => {
    let existToken;

    if (accessToken) {
      existToken = accessToken;
    } else {
      const twilioAccess = await backendTwilioAccessClient.createAccessToken(inputUsername);
      existToken = twilioAccess.accessToken;
      setAccessToken(existToken);
    }

    //Start New or Join Existing Room
    try {
      const joinedRoom = await twilioVideoClient.startNewVideoRoomOneOnOne(existToken, inputRoomName);
      setRoom(joinedRoom);
    } catch (error) {
      if (error.response.status == ERROR_STATUS_ROOM_EXIST) {
        const joinedRoom = await twilioVideoClient.joinVideoRoom(existToken, inputRoomName);
        setRoom(joinedRoom);
        console.log(`Room ${inputRoomName} already exist, hence we just join it.`)
      } else {
        console.error(JSON.stringify(error), error);
      }
    }

    setJoinStatus(VideoStatus.CONNECTED);
    props.callbackStartVideoCall({accessToken, username: inputUsername, room});
  }

  const onLeaveVideoCall = () => {
    const disconnectedRoom = room?.disconnect();
    setRoom(disconnectedRoom);
    setJoinStatus(VideoStatus.DISCONNECTED);
  }

  return (
    <div className={'row bg-light pt-2 pb-2 gx-5'}>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Username'} title={'username'} className={'form-control'}
               value={inputUsername}
               disabled={isJoinedVideo()}
               onChange={(e) => setInputUsername(e.target.value)}/>
      </div>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Room unique name'} title={'Room Unique Name'} className={'form-control'}
               value={inputRoomName}
               disabled={isJoinedVideo()}
               onChange={(e) => setInputRoomName(e.target.value)}/>
      </div>
      <div className={'col-3'}>
        <select disabled={isJoinedVideo()} title={'Camera option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Cam 01</option>
          <option value={'02'}>Cam 02</option>
        </select>
      </div>
      <div className={'col-3'}>
        <select disabled={isJoinedVideo()} title={'Audio option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Audio 01</option>
          <option value={'02'}>Audio 02</option>
        </select>
      </div>
      <div className={'col-2'}>
        <button onClick={onStartVideoRoom} hidden={isJoinedVideo()} className={'btn btn-primary'}>
          Join Room
        </button>
        <button onClick={onLeaveVideoCall} hidden={joinStatus === VideoStatus.DISCONNECTED || joinStatus === VideoStatus.NONE}
                className={'btn btn-primary'}>
          Leave Room
        </button>

      </div>
      <div className={'col-12'}>
        Room info: {room?.sid}, status: {room?.state} <p/>
        Local Participant: {JSON.stringify(room?.localParticipant)}
      </div>
    </div>
  );
};

export default VideoRoomStarter;
