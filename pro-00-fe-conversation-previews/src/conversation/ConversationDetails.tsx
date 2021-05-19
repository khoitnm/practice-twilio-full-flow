import React, {useEffect, useState} from "react";
import './css/ConversationDetails.css';
import './css/MessageList.css';
import {Message} from "@twilio/conversations/lib/message";
import {Participant} from "@twilio/conversations/lib/participant";
import ConversationMessage from "./message/ConversationMessage";
import TypingMessage from "./TypingMessage";
import MessageSender from "./MessageSender";
import CallStarterController from "../video-call/call-starter/CallStarterController";
import conversationHelper from "./helper/ConversationHelper";
import twilioConversationService from "../common/twilio/conversation/TwilioConversationService";
import arrayHelper from "../common/util/ArrayHelper";
import UpdatedMessage from "./helper/UpdatedMessage";
import CachedConversation from "./CachedConversation";
import Client from "@twilio/conversations";
import BeVideoRoom from "../common/twilio/video/BeVideoRoom";
import {Room} from "twilio-video";

export interface ConversationDetailsProps {
  localParticipantIdentity: string,
  conversationClient: Client,
  cachedConversation: CachedConversation,
  waitingRoom?: BeVideoRoom,
  setWaitingRoom: (beVideoRoom?: BeVideoRoom) => void,
  room?: Room,
  setRoom: (room?: Room) => void,
}

const ConversationDetails = ({
                               localParticipantIdentity,
                               conversationClient,
                               cachedConversation,
                               waitingRoom,
                               setWaitingRoom,
                               room,
                               setRoom,
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
    if (cachedConversation) {
      twilioConversationService.getMessages(cachedConversation.conversation).then(messagesPage => {
        setMessages(messagesPage.items);
      });
    }

    // The listener should be defined inside useEffect
    // so that the same method instance could be reused when removing the listener (conversation.off(...))
    const listenMessageAdded = (addedMessage: Message) => {
      //TODO need to reorder because there could be many messages sent asynchronously
      setMessages(prevState => [...prevState, addedMessage]);
    };

    const listenMessageUpdated = (updatedMessage: UpdatedMessage) => {
      setMessages(prevState => arrayHelper.replaceItem(prevState, updatedMessage.message, 'sid'));
    }
    cachedConversation?.conversation.on("messageAdded", listenMessageAdded);
    cachedConversation?.conversation.on("messageUpdated", listenMessageUpdated);
    return () => {
      cachedConversation?.conversation.off('messageAdded', listenMessageAdded);
      cachedConversation?.conversation.off("messageUpdated", listenMessageUpdated);
      setMessages([]);
    }
  }, [cachedConversation]);

  useEffect(() => {
    const remoteParticipantIdentitiesString = conversationHelper.getIdentitiesString(cachedConversation.remoteParticipants);
    setParticipantIdentitiesString(remoteParticipantIdentitiesString);

    // Doc http://media.twiliocdn.com/sdk/js/conversations/releases/0.1.0/docs/Client.html#event:typingStarted
    const listenTypingStarted = (newTypingParticipant: Participant) => {
      setTypingParticipant(newTypingParticipant);
    }
    const listenTypingEnded = (newTypingParticipant: Participant) => {
      setTypingParticipant(undefined);
    }
    cachedConversation?.conversation.on("typingStarted", listenTypingStarted);
    cachedConversation?.conversation.on("typingEnded", listenTypingEnded);
    return () => {
      cachedConversation?.conversation.off("typingStarted", listenTypingStarted);
      cachedConversation?.conversation.off("typingEnded", listenTypingEnded);
      setParticipantIdentitiesString('');
      setTypingParticipant(undefined);
    }
  }, [localParticipantIdentity, cachedConversation]);


  return (
    <>
      <div className={'row conversation-header'}>
        <div className={'col-sm-6 '}>
          <div className={'conversation-header-remote-user'}>{participantIdentitiesString}</div>
          <div
            className={'conversation-header-conversation-id'}>{cachedConversation.conversation.uniqueName} - {cachedConversation.conversation.sid} .
            started
            by {localParticipantIdentity}</div>
        </div>
        <div className={'col-sm-6 text-end'}>
          <CallStarterController localUserIdentity={localParticipantIdentity}
                                 conversationClient={conversationClient}
                                 cachedConversation={cachedConversation}
                                 waitingRoom={waitingRoom}
                                 setWaitingRoom={setWaitingRoom}
                                 room={room}
                                 setRoom={setRoom}/>
        </div>
      </div>
      <div className={'row messages'}>
        <div className={'col-12'}>
          {messages.map(message =>
            <ConversationMessage key={message.sid} localParticipantIdentity={localParticipantIdentity} message={message}/>
          )}
        </div>
        {typingParticipant &&
        <div className={'col-12'}>
            <TypingMessage typingParticipant={typingParticipant}/>
        </div>
        }
      </div>
      <MessageSender localParticipantIdentity={localParticipantIdentity} cachedConversation={cachedConversation}/>
    </>
  );
};

export default ConversationDetails;
