import React from "react";
import {Participant} from "@twilio/conversations/lib/participant";

export interface TypingMessageProps {
  typingParticipant: Participant
}

const TypingMessage = ({typingParticipant}: TypingMessageProps): JSX.Element => {
  return (
    <div className={'row message'}>
      <div className={'col-12 message-author'}>
        <span className={'message-author-name'}>{typingParticipant.identity}</span>
        <span className={'message-author-time'}></span>
      </div>
      <div className={'col-12 message-content'}>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span className={'px-2'}>Typing...</span>
      </div>

    </div>
  );
};
export default TypingMessage;