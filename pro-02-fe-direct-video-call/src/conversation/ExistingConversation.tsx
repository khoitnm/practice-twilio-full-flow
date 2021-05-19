import React, {useEffect, useState} from "react";
import conversationHelper from "./helper/ConversationHelper";
import CachedConversation from "./CachedConversation";
import callMessageHelper from "../video-call/call-event/CallMessageHelper";
import callEventHelper from "../video-call/call-event/CallEventHelper";
import callEventMapper from "../video-call/call-event/CallEventMapper";

export interface ExistingConversationProps {
  cachedConversation: CachedConversation,
  localParticipantIdentity: string,
  onSelectConversationCallback: (conversation: CachedConversation) => void,

}

const ExistingConversation = ({
                                localParticipantIdentity,
                                cachedConversation,
                                onSelectConversationCallback
                              }: ExistingConversationProps): JSX.Element => {
  const [participantIdentitiesString, setParticipantIdentitiesString] = useState<string>('');

  useEffect(() => {
    const participantIdentitiesString = conversationHelper.getIdentitiesString(cachedConversation.remoteParticipants);
    setParticipantIdentitiesString(participantIdentitiesString);
  }, [localParticipantIdentity, cachedConversation]);

  const onSelectConversation = () => {
    onSelectConversationCallback(cachedConversation);
  }

  let lastMessageComponent;
  if (cachedConversation.lastMessage) {
    const isCallMessage = callMessageHelper.isCallMessage(cachedConversation.lastMessage);
    if (isCallMessage) {
      const lastCallEvent = callEventMapper.toCallEventFromMessage(cachedConversation.lastMessage);
      lastMessageComponent = <span className={'conversation-item-name'}>{lastCallEvent.videoStartedParticipantIdentity}: Call</span>
    } else {
      lastMessageComponent = <span className={'conversation-item-name'}>{cachedConversation.lastMessage.author}: {cachedConversation.lastMessage.body}</span>
    }
  } else {
    lastMessageComponent = undefined;
  }

  return (
    <div className={'row remote-user-item'} onClick={onSelectConversation}>
      <div className={'col-12'}>
        <span className={'conversation-item-participant-identities'}>{participantIdentitiesString}</span>
      </div>
      <div className={'col-12'}>
        {lastMessageComponent}
      </div>
    </div>
  );
};

export default ExistingConversation;