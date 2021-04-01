import React, {useState} from "react";
import {Room} from "twilio-video";

export interface VideoRoomStarterProps {
  callbackStartVideoCall: (result: any) => void;
};

const VideoRoomStarter = (props: VideoRoomStarterProps): JSX.Element => {
  let accessToken: string;
  let room: Room;

  const [inputUsername, setInputUsername] = useState<string>('user01');
  const [inputRoomName, setInputRoomName] = useState<string>('room01');//We use the name 'inputRoomName' to distinguish with room.name
  const [joinStatus, setJoinStatus] = useState<boolean>(false);//whether joined Video Room or not.

  const onStartVideoRoom = () => {
    console.log(`${inputUsername} - ${inputRoomName}`);
    setJoinStatus(true);
    props.callbackStartVideoCall({accessToken, username: inputUsername, room});
  }
  const onLeaveVideoCall = () => {
    setJoinStatus(false);
  }

  return (
    <div className={'row bg-light pt-2 pb-2 gx-5'}>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Username'} title={'username'} className={'form-control'}
               disabled={joinStatus}
               onChange={(e) => setInputUsername(e.target.value)}/>
      </div>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Room unique name'} title={'Room Unique Name'} className={'form-control'}
               disabled={joinStatus}
               onChange={(e) => setInputRoomName(e.target.value)}/>
      </div>
      <div className={'col-3'}>
        <select disabled={joinStatus} title={'Camera option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Cam 01</option>
          <option value={'02'}>Cam 02</option>
        </select>
      </div>
      <div className={'col-3'}>
        <select disabled={joinStatus} title={'Audio option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Audio 01</option>
          <option value={'02'}>Audio 02</option>
        </select>
      </div>
      <div className={'col-2'}>
        <button onClick={onStartVideoRoom} hidden={joinStatus} className={'btn btn-primary'}>
          Start New Room
        </button>
        <button onClick={onLeaveVideoCall} hidden={!joinStatus} className={'btn btn-primary'}>
          Leave Room
        </button>

      </div>
    </div>

  );
};

export default VideoRoomStarter;
