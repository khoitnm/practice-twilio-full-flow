import React, {useEffect, useState} from "react";
import '../Modal.css';
import './CallStarter.css';
import CachedConversation from "../../conversation/CachedConversation";
import conversationHelper from "../../conversation/helper/ConversationHelper";

export interface CallStarterModalProps {
  cachedConversation: CachedConversation
  onCallCancel: () => void;
}

const CallStarterModal = ({cachedConversation, onCallCancel}: CallStarterModalProps): JSX.Element => {
  const [participantIdentitiesString, setParticipantIdentitiesString] = useState<string>('');

  useEffect(() => {
    const remoteParticipantIdentitiesString = conversationHelper.getIdentitiesString(cachedConversation.remoteParticipants);
    setParticipantIdentitiesString(remoteParticipantIdentitiesString);
  }, [cachedConversation]);

  return (
    <>
      <div className={"simple-modal"}>
        <div className={'simple-modal-panel text-center'}>
          <div className={'simple-modal-avatar p-3'}>
            <i className="bi bi-person-circle"></i>
          </div>
          <div className={'simple-modal-participants pb-3 px-3'}>
            Calling to <span className={'to-participants'}>{participantIdentitiesString}</span>
          </div>
          <div className={'simple-modal-buttons pt-3'}>
            <button onClick={onCallCancel} type="button" className="simple-bottom-button simple-button-alert w-100">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className={"simple-modal-overlay"}/>
    </>
  );
};
export default CallStarterModal;