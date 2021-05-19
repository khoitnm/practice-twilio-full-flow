import React from "react";
import BeUser from "../common/twilio/conversation/BeUser";

export interface RemoteUserProps {
  user: BeUser,
  onSelectUserCallback: (newRemoteUser: BeUser) => void,

}

const RemoteUser = ({user, onSelectUserCallback}: RemoteUserProps): JSX.Element => {

  const onSelectUser = () => {
    onSelectUserCallback(user);
  }

  return (
    <div className={'row remote-user-item'} onClick={onSelectUser}>
      <div className={'col-12'} >
        {user.identity}
      </div>
    </div>
  );
};

export default RemoteUser;