import React from "react";
import {Message} from "@twilio/conversations/lib/message";
import callMessageHelper from "../../video-call/call-event/CallMessageHelper";
import callEventMapper from "../../video-call/call-event/CallEventMapper";

export interface ConversationCallMessageProps {
  localParticipantIdentity: string,
  message: Message
}

const ConversationCallMessage = ({localParticipantIdentity, message}: ConversationCallMessageProps): JSX.Element => {
  const callEvent = callEventMapper.toCallEventFromMessage(message);
  let messageContent;
  if (callMessageHelper.isCallCanceledMessage(message)) {
    const callInfo = (callEvent.videoStartedParticipantIdentity !== localParticipantIdentity)? "Missed Call": "No response for the call";
    messageContent = <>
      <span className={'ms-5 call-message-icon call-message-icon-alert'}><i className="bi bi-telephone-x"></i></span> {callInfo}
    </>;
  } else {
    const callDurationInMills = callEvent.eventDate.getTime() - callEvent.callStartedDate.getTime();
    const callDurationInSecs = callDurationInMills / 1000 ;
    const callDurationInMins = callDurationInSecs / 60;
    const callDuration: string = callDurationInMins > 1?
      `${callDurationInMins.toLocaleString(undefined, {maximumFractionDigits:2})} minutes`:
      `${callDurationInSecs.toLocaleString(undefined, {maximumFractionDigits:2})} seconds`;
    messageContent = <>
      <span className={'ms-5 call-message-icon call-message-icon-highlight'}><i className="bi bi-camera-video"></i></span> Video Call ({callDuration})
    </>;
  }
  return (
    <div className={'d-flex flex-row message'}>
      <div className={'message-payload'}>
        <div className={'message-author'}>
          {/*
          We don't show the last user who updated the message (author of last event).
          We only show the first user who started the call (author who sent the first message)
          */}
          <span className={'message-author-name'}>{callEvent.videoStartedParticipantIdentity}</span>
          <span className={'message-author-time'}>{message.dateCreated.toLocaleString()}</span>
        </div>
        <div className={'call-message-content mt-2'}>
          {messageContent}
        </div>
      </div>
    </div>
  );
};
export default ConversationCallMessage;