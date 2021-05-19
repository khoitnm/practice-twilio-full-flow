import React from "react";
import {Message} from "@twilio/conversations/lib/message";
import callMessageHelper from "../../video-call/call-event/CallMessageHelper";
import ConversationCallMessage from "./ConversationCallMessage";
import ConversationTextMessage from "./ConversationTextMessage";

export interface ConversationMessageProps {
  localParticipantIdentity: string,
  message: Message
}

const ConversationMessage = ({localParticipantIdentity, message}: ConversationMessageProps): JSX.Element => {

  let messageComponent;
  if (callMessageHelper.isCallMessage(message)) {
    messageComponent = <ConversationCallMessage localParticipantIdentity={localParticipantIdentity} message={message}/>;
  } else {
    messageComponent = <ConversationTextMessage message={message}/>;
  }

  return (
    <>
      {messageComponent}
    </>
  );
};
export default ConversationMessage;