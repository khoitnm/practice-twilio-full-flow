import React, {ChangeEvent, useEffect, useState} from "react";
import beConversationService from "../common/twilio/conversation/BeConversationService";
import BeUser from "../common/twilio/conversation/BeUser";

export interface UserCreationProps {
  localUserIdentity: string
  onCreateNewUserCallback: (createdUser: BeUser) => void;
}

const UserCreation = ({localUserIdentity, onCreateNewUserCallback}: UserCreationProps): JSX.Element => {
  const [newUserIdentifier, setNewUserIdentifier] = useState<string>('');

  useEffect(() => {
    return () => {
      setNewUserIdentifier('');
    }
  }, [])

  const onChangeNewUserIdentifier = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewUserIdentifier(event.target.value);
  }
  const onCreateNewUser = async (event: any): Promise<void> => {
    if (newUserIdentifier) {
      const userBe = await beConversationService.createUser(newUserIdentifier);
      if (userBe.identity !== localUserIdentity) {
        onCreateNewUserCallback(userBe);
      }
      setNewUserIdentifier('');
    }
  }

  return (
    <div className="input-group mb-3">
      <input type="text" value={newUserIdentifier} onChange={onChangeNewUserIdentifier}
             className="form-control" placeholder="New User Identifier" aria-label="New User Identifier" aria-describedby="basic-addon2"/>
      <span className="input-group-text button-group-input" id="basic-addon2" onClick={onCreateNewUser} title={"Create New User in Twilio system"}>
         <i className="bi bi-person-plus"/>
      </span>
    </div>
  );
};
export default UserCreation;