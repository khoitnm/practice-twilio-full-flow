import React from "react";
import '../Modal.css';
import './CallsReceiver.css';
import CallEvent from "../call-event/CallEvent";
import callEventHelper from "../call-event/CallEventHelper";

export interface CallsReceiverModalProps {
  callEvents: Map<string, CallEvent>;
  onDeclineCallback: (previousCallEvent: CallEvent) => void;
  onAcceptCallback: (previousCallEvent: CallEvent) => void;
}

const CallsReceiverModal = ({callEvents, onDeclineCallback, onAcceptCallback}: CallsReceiverModalProps): JSX.Element => {

  const callEventsJsx: JSX.Element[] = [];
  callEvents.forEach((callEvent: CallEvent, roomSid: string) => {
    if (!callEventHelper.isCallRequestEvent(callEvent)) return;
    callEventsJsx.push(
      <div key={roomSid} className={'simple-modal-panel m-3 p-3 text-center'}>
        <div className={'simple-modal-avatar'}>
          <i className="bi bi-person-circle"></i>
        </div>
        <div className={'simple-modal-participants py-3'}>
          Calling from <span className={'from-participant'}>{callEvent.conversationAuthorParticipantIdentity}</span>
        </div>
        <div className={'simple-modal-buttons pt-3'}>
          <button onClick={() => onAcceptCallback(callEvent)} type="button" className="simple-button simple-button-highlight mx-2">
            <i className="bi bi-telephone-fill"></i>
          </button>
          <button onClick={() => onDeclineCallback(callEvent)} type="button" className="simple-button simple-button-alert mx-2">
            <i className="bi bi-x-circle"></i>
          </button>
        </div>
      </div>
    )
  });

  return (
    <>
      <div className={"simple-modal "}>
        {callEventsJsx}
      </div>
      <div className={"simple-modal-overlay"}/>
    </>
  );
};
export default CallsReceiverModal;