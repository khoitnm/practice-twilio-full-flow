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
  onEndVideoCall: () => void;
};

const VideoRoomStarter = ({
                            inputRoomName,
                            inputUsername,
                            room,
                            onChangeInputUsername,
                            onChangeInputRoomName,
                            onStartVideoRoom,
                            onLeaveVideoCall,
                            onEndVideoCall
                          }: VideoRoomStarterProps): JSX.Element => {
  const isJoinedVideo = room?.state === 'connected';

  return (
    <div className={'row bg-light pt-2 pb-2 video-starter'}>
      <div className={'col-md-2'}>
        <input type={'input'} placeholder={'Username'} title={'username'} className={'form-control'}
               value={inputUsername}
               disabled={isJoinedVideo}
               onChange={onChangeInputUsername}/>
      </div>
      <div className={'col-md-2'}>
        <input type={'input'} placeholder={'Room unique name'} title={'Room Unique Name'} className={'form-control'}
               value={inputRoomName}
               disabled={isJoinedVideo}
               onChange={onChangeInputRoomName}/>
      </div>
      <div className={'col-md-3'}>
        <select disabled={isJoinedVideo} title={'Camera option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Cam 01 (TODO)</option>
          <option value={'02'}>Cam 02</option>
        </select>
      </div>
      <div className={'col-md-3'}>
        <select disabled={isJoinedVideo} title={'Audio option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Audio 01 (TODO)</option>
          <option value={'02'}>Audio 02</option>
        </select>
      </div>
      <div className={'col-md-2'}>
        <button onClick={onStartVideoRoom} hidden={isJoinedVideo} className={'btn btn-primary w-50'}>
          Join
        </button>
        <div hidden={!isJoinedVideo} className="btn-group w-100" role="group" aria-label="Basic example">
          <button onClick={onLeaveVideoCall} className={'btn btn-primary'} title={"Leave Video Room. Other Participants still continue normally."}>
            Leave
          </button>
          <button onClick={onEndVideoCall} hidden={!isJoinedVideo} className={'btn btn-danger'} title={"Close Video call for ALL Participants."}>
            End
          </button>
        </div>

      </div>
      <div className={'col-12'}>
        {/*Room info: {room?.sid}, status: {room?.state} <p/>*/}
        {/*Local Participant: {JSON.stringify(room?.localParticipant)}*/}
      </div>
    </div>
  );
};

export default VideoRoomStarter;
