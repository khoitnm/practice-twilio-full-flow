import React, {ChangeEvent, useEffect, useState} from "react";
import './css/ConversationPage.css';
import beConversationService from "../common/twilio/conversation/BeConversationService";
import twilioConversationService from "../common/twilio/conversation/TwilioConversationService";
import twilioConversationClientFactory from "../common/twilio/conversation/TwilioConversationClientFactory";
import potentialConversationHelper from "./helper/PotentialConversationHelper";
import {Conversation} from "@twilio/conversations/lib/conversation";
import BeUser from "../common/twilio/conversation/BeUser";
import Client from "@twilio/conversations";
import RemoteUser from "./RemoteUser";
import ConversationStarter from "./ConversationStarter";
import ConversationDetails from "./ConversationDetails";
import ExistingConversation from "./ExistingConversation";
import UserCreation from "./UserCreation";

const nextParticipantIdentifier = () => {
  let currentUserIdStr = localStorage.getItem('currentConversationParticipantIdentifier');
  if (!currentUserIdStr) {
    currentUserIdStr = '0';
  }
  let nextUserId: number = (+currentUserIdStr) + 1;
  if (nextUserId > 3) {
    nextUserId = 1;
  }
  localStorage.setItem('currentConversationParticipantIdentifier', nextUserId.toString())
  return 'user' + nextUserId;
}

const ConversationPage = (): JSX.Element => {
  // User Starting: Begin ////////////////////////////////////////////////////////////////////////
  // User: is just general user who could have joined a conversation or not.
  // Participant: is the User who already joined a conversation.
  // That's why in this case, we use the term `User` instead of `Participant` because this User may have not joined any conversation yet.
  const [localUserIdentity, setLocalUserIdentity] = useState<string>(nextParticipantIdentifier());

  // The User has logged in or not.
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [existingConversations, setExistingConversations] = useState<Array<Conversation>>([]);
  const [allUsers, setAllUsers] = useState<Array<BeUser>>([]);
  const [potentialRemoteUsers, setPotentialRemoteUsers] = useState<Array<BeUser>>([]); // the list of users who has not join any conversation with this localUser
  const [conversationClient, setConversationClient] = useState<Client>();

  useEffect(() => {
    return () => {
      onLogOut().then(() => {
        console.log("Clean up ConversationPage!")
      });
    }
  }, [])

  useEffect(() => {
    potentialConversationHelper.filterRemoteUsersNotInPeerConversations(localUserIdentity, existingConversations, allUsers)
      .then(potentialRemoteUsers => setPotentialRemoteUsers(potentialRemoteUsers));
  }, [localUserIdentity, existingConversations, allUsers])

  const onChangeLocalParticipantIdentifier = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalUserIdentity(event.target.value);
    //setAccessToken(undefined);
  }
  const onLogIn = async () => {
    const users: Array<BeUser> = await beConversationService.findAllUsers();
    setLoggedIn(true);
    setAllUsers(users);

    const conversations = await twilioConversationService.loadConversationsList(localUserIdentity);
    setExistingConversations(conversations.items);

    const client = await twilioConversationClientFactory.getClient(localUserIdentity);
    setConversationClient(client);
  }

  const onLogOut = async () => {
    setLoggedIn(false);
    setAllUsers([]);
    setConversation(undefined);
    setConversationClient(undefined);
  }
  // User Starting: End ////////////////////////////////////////////////////////////////////////

  // Conversation List ////////////////////////////////////////////////////////////////////
  const onSwitchConversationCallback = async (selectedConversation: Conversation): Promise<void> => {
    setConversation(selectedConversation);
  }

  // Users List: Begin ////////////////////////////////////////////////////////////////////
  const onSwitchRemoteUserCallback = async (selectedRemoteUser: BeUser): Promise<void> => {
    const switchedConversation = await twilioConversationService.createConversationIfNotExist(localUserIdentity, selectedRemoteUser.identity);
    setExistingConversations(prevState => [...prevState, switchedConversation]);
    setConversation(switchedConversation);
  }

  const onCreateNewUserCallback = (createdUser: BeUser): void => {
    setAllUsers((prevState => {
      return [createdUser, ...prevState];
    }))
  }
  // Users List: End ////////////////////////////////////////////////////////////////////

  // Conversation Details: Begin ///////////////////////////////////////////////////////////////////////
  const [conversation, setConversation] = useState<Conversation | undefined>();
  // Conversation Details: End ///////////////////////////////////////////////////////////////////////

  return (
    <>
      <ConversationStarter
        localUserIdentifier={localUserIdentity}
        loggedIn={loggedIn}
        conversationClient={conversationClient}
        onChangeLocalUserIdentifier={onChangeLocalParticipantIdentifier}
        onLogIn={onLogIn}
        onLogOut={onLogOut}
      />
      {loggedIn &&
      <div className={'row bg-light'}>
          <div className={'col-3 conversations-list'}>
              <UserCreation localUserIdentity={localUserIdentity} onCreateNewUserCallback={onCreateNewUserCallback}/>

            {existingConversations.map((conversation: Conversation) => (
              <ExistingConversation key={conversation.sid}
                                    localParticipantIdentity={localUserIdentity}
                                    conversation={conversation}
                                    onSelectConversationCallback={onSwitchConversationCallback}/>
            ))}

            {potentialRemoteUsers.map((remoteUser: BeUser) => (
              <RemoteUser key={remoteUser.identity} user={remoteUser} onSelectUserCallback={onSwitchRemoteUserCallback}/>
            ))}
          </div>
          <div className={'col-9'}>
            {conversation &&
            <ConversationDetails localParticipantIdentity={localUserIdentity}
                                 conversation={conversation}/>
            }

          </div>
      </div>
      }
    </>
  );
};

export default ConversationPage;
