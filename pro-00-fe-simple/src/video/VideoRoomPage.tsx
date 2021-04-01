import React from "react";

const styleVideoCall = {
  border: "1px solid #BBB",
  borderRadius: '5px',
  backgroundColor: "#DDD",
};

const VideoRoomPage = (): JSX.Element => {

  return (
    <div className={'container'}>

      {/*Starting row: begin*/}
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
          <button className={'btn btn-primary'}>Start New Room</button>
        </div>
      </div>
      {/*Starting row: end*/}

      {/*Body row: begin*/}
      <div className={'row gx-5 mt-2'}>

        {/*Main Video Call: begin*/}
        <div className={'col-9'} style={styleVideoCall}>

        </div>
        {/*Main Video Call: end*/}

        {/*Other Rooms: begin*/}
        <div className={'col-3'}>
          <div className={'pb-3'} style={{textAlign: "center"}}>
            Rooms
          </div>
          <div>
            <button className={'btn btn-outline-primary w-100'} title={'Room01 Sid SRxxxxxxxxxxxxxxx'}>Room01</button>
          </div>

        </div>
        {/*Other Rooms: end*/}

      </div>
      {/*Body row: end*/}

    </div>
  );
};

export default VideoRoomPage;
