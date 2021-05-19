import React, {useEffect, useState} from "react";
import {Conversation} from "@twilio/conversations/lib/conversation";
import conversationHelper from "./helper/ConversationHelper";

export interface ExistingConversationProps {
  conversation: Conversation,
  localParticipantIdentity: string,
  onSelectConversationCallback: (conversation: Conversation) => void,

}

const ExistingConversation = ({localParticipantIdentity, conversation, onSelectConversationCallback}: ExistingConversationProps): JSX.Element => {
  const [participantIdentitiesString, setParticipantIdentitiesString] = useState<string>('');

  useEffect(() => {
    conversationHelper.getParticipantIdentitiesString(localParticipantIdentity, conversation).then(result => {
      setParticipantIdentitiesString(result);
    });
  }, [localParticipantIdentity, conversation]);

  const onSelectConversation = () => {
    onSelectConversationCallback(conversation);
  }

  return (
    <div className={'row remote-user-item'} onClick={onSelectConversation}>
      <div className={'col-12'}>
        <span className={'conversation-item-participant-identities'}>{participantIdentitiesString}</span>
      </div>
      <div className={'col-12'}>
        <span className={'conversation-item-name'}>{conversation.uniqueName}</span>
      </div>
    </div>
  );
};

export default ExistingConversation;