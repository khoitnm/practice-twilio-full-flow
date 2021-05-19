import React from "react";
import {Message} from "@twilio/conversations/lib/message";

export interface ConversationTextMessageProps {
  message: Message
}

const ConversationTextMessage = ({message}: ConversationTextMessageProps): JSX.Element => {
  return (
    <div className={'d-flex flex-row message'}>
      {/*<div className={'message-avatar'}>*/}
      {/*  <i className="bi bi-person-circle" style={{fontSize: "xx-large"}}></i>*/}
      {/*</div>*/}
      <div className={'message-payload'}>
        <div className={'message-author'}>
          <span className={'message-author-name'}>{message.author}</span>
          <span className={'message-author-time'}>{message.dateCreated.toLocaleString()}</span>
        </div>
        <div className={'message-content'}>
          {message.body} <br/>
        </div>
      </div>
    </div>
  );
};
export default ConversationTextMessage;