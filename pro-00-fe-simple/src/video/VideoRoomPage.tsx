import React from "react";

const VideoRoomPage = (): JSX.Element => {

  return (
    <div className={'container'}>
      {/*Starting row*/}
      <div className={'row bg-light pt-2 pb-2 gx-5'}>
        <div className={'col-3'}>
          <input type={'input'} placeholder={'user01'} title={'username'} className={'form-control'}/>
        </div>
        <div className={'col-3'}>
          <input type={'input'} placeholder={'room01'} title={'Room Unique Name'} className={'form-control'}/>
        </div>
        <div className={'col-3'}>
          <select title={'Camera option'} defaultValue={'01'} className={'form-select'}>
            <option value={'01'}>Cam 01</option>
            <option value={'02'}>Cam 02</option>
          </select>
        </div>
        <div className={'col-3'}>
          <button className={'btn btn-primary'}>Start New Room</button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoomPage;
