import React, {ChangeEvent} from "react";
import {Room} from "twilio-video";

export interface VideoRoomStarterProps {
  inputUsername: string,
  inputRoomName: string,
  room?: Room,

  onChangeInputUsername: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeInputRoomName: (event: ChangeEvent<HTMLInputElement>) => void;
  onStartVideoRoom: () => void;
  onLeaveVideoCall: () => void;
};

const VideoRoomStarter = ({
                            inputRoomName,
                            inputUsername,
                            room,
                            onChangeInputUsername,
                            onChangeInputRoomName,
                            onStartVideoRoom,
                            onLeaveVideoCall
                          }: VideoRoomStarterProps): JSX.Element => {
  const isJoinedVideo = room?.state === 'connected';

  return (
    <div className={'row bg-light pt-2 pb-2'}>
      <div className={'col-md-2'}>
        <input type={'input'} placeholder={'Username'} title={'username'} className={'form-control'}
               value={inputUsername}
               disabled={isJoinedVideo}
               onChange={onChangeInputUsername}/>
      </div>
      <div className={'col-md-3'}>
        <input type={'input'} placeholder={'Room unique name'} title={'Room Unique Name'} className={'form-control'}
               value={inputRoomName}
               disabled={isJoinedVideo}
               onChange={onChangeInputRoomName}/>
      </div>
      <div className={'col-md-3'}>
        <select disabled={isJoinedVideo} title={'Camera option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Cam 01</option>
          <option value={'02'}>Cam 02</option>
        </select>
      </div>
      <div className={'col-md-2'}>
        <select disabled={isJoinedVideo} title={'Audio option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Audio 01</option>
          <option value={'02'}>Audio 02</option>
        </select>
      </div>
      <div className={'col-md-2'}>
        <button onClick={onStartVideoRoom} hidden={isJoinedVideo} className={'btn btn-primary w-100'}>
          Join
        </button>
        <button onClick={onLeaveVideoCall} hidden={!isJoinedVideo} className={'btn btn-primary w-100'}>
          Leave
        </button>

      </div>
      <div className={'col-12'}>
        Room info: {room?.sid}, status: {room?.state} <p/>
        {/*Local Participant: {JSON.stringify(room?.localParticipant)}*/}
      </div>
    </div>
  );
};

export default VideoRoomStarter;
