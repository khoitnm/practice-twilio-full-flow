import React, {useEffect, useState} from "react";
import './css/ConversationDetails.css';
import './css/MessageList.css';
import {Conversation} from "@twilio/conversations/lib/conversation";
import {Message} from "@twilio/conversations/lib/message";
import {Participant} from "@twilio/conversations/lib/participant";
import ConversationMessage from "./ConversationMessage";
import TypingMessage from "./TypingMessage";
import MessageSender from "./MessageSender";
import conversationHelper from "./helper/ConversationHelper";
import twilioConversationService from "../common/twilio/conversation/TwilioConversationService";

export interface ConversationDetailsProps {
  localParticipantIdentity: string,
  conversation: Conversation,
}

const ConversationDetails = ({
                               localParticipantIdentity,
                               conversation,
                             }: ConversationDetailsProps): JSX.Element => {

  const [typingParticipant, setTypingParticipant] = useState<Participant | undefined>(undefined);
  const [participantIdentitiesString, setParticipantIdentitiesString] = useState<string>('');
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    return () => {
      //Clean up
      setTypingParticipant(undefined);
      setParticipantIdentitiesString('');
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    if (conversation) {
      twilioConversationService.getMessages(conversation).then(messagesPage => {
        setMessages(messagesPage.items);
      });
    }

    const listenMessageAdded = (addedMessage: Message) => {
      //TODO need to reorder because there could be many messages sent asynchronously
      setMessages(prevState => [...prevState, addedMessage]);
    };
    conversation?.on("messageAdded", listenMessageAdded);
    return () => {
      conversation?.off('messageAdded', listenMessageAdded);
      setMessages([]);
    }
  }, [conversation]);

  useEffect(() => {
    conversationHelper.getParticipantIdentitiesString(localParticipantIdentity, conversation).then(result => {
      setParticipantIdentitiesString(result);
    });

    // Doc http://media.twiliocdn.com/sdk/js/conversations/releases/0.1.0/docs/Client.html#event:typingStarted
    const listenTypingStarted = (newTypingParticipant: Participant) => {
      setTypingParticipant(newTypingParticipant);
    }
    const listenTypingEnded = (newTypingParticipant: Participant) => {
      setTypingParticipant(undefined);
    }
    conversation?.on("typingStarted", listenTypingStarted);
    conversation?.on("typingEnded", listenTypingEnded);
    return () => {
      conversation?.off("typingStarted", listenTypingStarted);
      conversation?.off("typingEnded", listenTypingEnded);
      setParticipantIdentitiesString('');
      setTypingParticipant(undefined);
    }
  }, [localParticipantIdentity, conversation]);

  return (
    <>
      <div className={'row conversation-header'}>
        <div className={'col-12 '}>
          <div className={'conversation-header-remote-user'}>{participantIdentitiesString}</div>
          <div className={'conversation-header-conversation-id'}>{conversation.uniqueName} - {conversation.sid} . started
            by {localParticipantIdentity}</div>
        </div>
      </div>
      <div className={'row messages'}>
        <div className={'col-12'}>
          {messages.map(message =>
            <ConversationMessage key={message.sid} message={message}/>
          )}
        </div>
        {typingParticipant &&
        <div className={'col-12'}>
            <TypingMessage typingParticipant={typingParticipant}/>
        </div>
        }
      </div>
      <MessageSender localParticipantIdentity={localParticipantIdentity} conversation={conversation}/>
    </>
  );
};

export default ConversationDetails;
