import React from "react";

export interface VideoRoomStarterProps {
  callbackStartVideoCall: () => void;
};

const VideoRoomStarter = (props: VideoRoomStarterProps): JSX.Element => {



  const onStartVideoCall = () => {
    props.callbackStartVideoCall();
  }

  return (
    <div className={'row bg-light pt-2 pb-2 gx-5'}>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Username'} title={'username'} className={'form-control'}/>
      </div>
      <div className={'col-2'}>
        <input type={'input'} placeholder={'Room unique name'} title={'Room Unique Name'} className={'form-control'}/>
      </div>
      <div className={'col-3'}>
        <select title={'Camera option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Cam 01</option>
          <option value={'02'}>Cam 02</option>
        </select>
      </div>
      <div className={'col-3'}>
        <select title={'Audio option'} defaultValue={'01'} className={'form-select'}>
          <option value={'01'}>Audio 01</option>
          <option value={'02'}>Audio 02</option>
        </select>
      </div>
      <div className={'col-2'}>
        <button className={'btn btn-primary'} onClick={onStartVideoCall}>Start New Room</button>
      </div>
    </div>

  );
};

export default VideoRoomStarter;
