import React, {ChangeEvent, FormEvent, MouseEvent, useEffect, useState} from "react";
import './css/ConversationPage.css';
import beConversationService from "../common/twilio/conversation/BeConversationService";
import twilioConversationService from "../common/twilio/conversation/TwilioConversationService";
import twilioConversationClientFactory from "../common/twilio/conversation/TwilioConversationClientFactory";
import potentialConversationHelper from "./helper/PotentialConversationHelper";
import BeUser from "../common/twilio/conversation/BeUser";
import Client from "@twilio/conversations";
import RemoteUser from "./RemoteUser";
import ConversationStarter from "./ConversationStarter";
import ConversationDetails from "./ConversationDetails";
import ExistingConversation from "./ExistingConversation";
import UserCreation from "./UserCreation";
import CallsReceiverController from "../video-call/call-receiver/CallsReceiverController";
import CachedConversation from "./CachedConversation";
import conversationHelper from "./helper/ConversationHelper";
import {Room} from "twilio-video";
import BeVideoRoom from "../common/twilio/video/BeVideoRoom";
import {TwilioError} from "twilio-video/tsdef/TwilioError";
import InCallScreen from "../video-call/in-call/InCallScreen";
import {Message} from "@twilio/conversations/lib/message";


const CODE_ROOM_END = 53118;
const CODE_RECONNECT_FAIL__EXPIRE_ACCESS_TOKEN = 20104;
const CODE_RECONNECT_FAIL__ATTEMPTS_EXHAUST = 53000;
const CODE_RECONNECT_FAIL__TOO_LONG = 53204;

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

  const [existingConversations, setExistingConversations] = useState<Array<CachedConversation>>([]);
  const [allUsers, setAllUsers] = useState<Array<BeUser>>([]);
  const [potentialRemoteUsers, setPotentialRemoteUsers] = useState<Array<BeUser>>([]); // the list of users who has not join any conversation with this localUser
  const [conversationClient, setConversationClient] = useState<Client>();

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      onLogOut();
    }
  }, [])

  useEffect(() => {
    const potentialRemoteUsers = potentialConversationHelper.filterRemoteUsersNotInPeerConversations(localUserIdentity, existingConversations, allUsers);
    setPotentialRemoteUsers(potentialRemoteUsers);
  }, [localUserIdentity, existingConversations, allUsers])

  // useEffect(() => {
  //   const onMessageAdded = (addedMessage: Message) => {
  //     //TODO update last message to conversation preview
  //   };
  //   conversationClient?.on("messageAdded", onMessageAdded);
  //   return () => {
  //     conversationClient?.off("messageAdded", onMessageAdded);
  //   };
  // }, [conversationClient]);

  const onChangeLocalParticipantIdentifier = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalUserIdentity(event.target.value.toLowerCase().trim());
  }

  const processLogin = async (localUserIdentity: string, retryTimes: number) => {
    try {
      setIsLoggingIn(true);

      const client = await twilioConversationClientFactory.newClient(localUserIdentity);
      setConversationClient(client);

      // Need to load conversations before loading all users
      const conversationPaginator = await twilioConversationService.loadConversationsList(localUserIdentity);
      const cachedConversations = await conversationHelper.toCachedConversations(localUserIdentity, conversationPaginator.items);
      setExistingConversations(cachedConversations);

      const users: Array<BeUser> = await beConversationService.findAllUsers();
      setLoggedIn(true);
      setAllUsers(users);
      setIsLoggingIn(false);
    } catch (error) {
      if (error.status === 403 && error.code === 54007) {
        const message = `Cannot login with user ${localUserIdentity}. Root cause: ${error.message}`;
        console.error(message, error);
        alert(message);
      } else if (retryTimes < 3) {
        const message = `Cannot login with user ${localUserIdentity}. Root cause: ${error.message}. 
        Sometimes it's just because of the delay from Twilio server when we trying to create accessToken for a new User. 
        So we just retry to login again: ${retryTimes}`;
        console.warn(message, error);
        await processLogin(localUserIdentity, ++retryTimes);
      }
    }
  }

  const onLogIn = async (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let retryTimes = 0;
    await processLogin(localUserIdentity, retryTimes);
  }

  const onLogOut = () => {
    setLoggedIn(false);
    setAllUsers([]);
    setConversation(undefined);
    setConversationClient(undefined);
    setWaitingRoom(undefined);
    setRoom(undefined);
  }
  // User Starting: End ////////////////////////////////////////////////////////////////////////

  // Conversation List ////////////////////////////////////////////////////////////////////
  const onSwitchConversationCallback = async (selectedConversation: CachedConversation): Promise<void> => {
    setConversation(selectedConversation);
  }

  // Users List: Begin ////////////////////////////////////////////////////////////////////
  const onSwitchRemoteUserCallback = async (selectedRemoteUser: BeUser): Promise<void> => {
    const selectedConversation = await twilioConversationService.createConversationIfNotExist(localUserIdentity, selectedRemoteUser.identity);
    const cachedConversation = await conversationHelper.toCachedConversation(localUserIdentity, selectedConversation);
    setExistingConversations(prevState => [...prevState, cachedConversation]);
    setConversation(cachedConversation);
  }

  const onCreateNewUserCallback = (createdUser: BeUser): void => {
    setAllUsers((prevState => {
      return [createdUser, ...prevState];
    }))
  }
  // Users List: End ////////////////////////////////////////////////////////////////////

  // Conversation Details: Begin ///////////////////////////////////////////////////////////////////////
  const [conversation, setConversation] = useState<CachedConversation | undefined>();


  /**
   * Starting:
   * 'waitingRoom' and 'room' states usually go together.
   * The only difference is, when sending a call request, we'll have 'waitingRoom' state but not 'room' yet.
   * We are only 'room' if there's at least another remote participant accept our call request.
   *
   * Ending:
   * When the room is disconnected (leave/end the call), the 'room' will become undefined.
   *
   * When the user join a room, the 'room' state will have value, while 'waitingRoom' will be undefined.
   * Those value should be set independently. We shouldn't compute 'room' based on 'waitingRoom'.
   */
  const [waitingRoom, setWaitingRoom] = useState<BeVideoRoom>();
  /**
   *
   * When this 'room' state has value, it means the user is being in a call.
   * And that call could be started by himself or by another participant, and he just joined it.
   * No matter what, he can join only one Call at a time, so we only need only one 'room' state at a time.
   */
  const [room, setRoom] = useState<Room>();
  useEffect(() => {
    const onRoomEnd = (room: Room, error: TwilioError) => {
      if (!error || error.code === CODE_ROOM_END) {
        console.log(`Room ${room.name} is ended.`)
        setRoom(undefined);
        // Be careful that when executing setRoom(undefined) here, it will trigger other compute logic when "room" state is changed.
        // So we just show log and do nothing.
        //  - Don't even think about "notifyCallEnded" message to Conversation because we are using Smart Publisher approach.
        //  - It basically means all of related processes already handled when we publish an event.
        return;
      }
      if (error.code === CODE_RECONNECT_FAIL__EXPIRE_ACCESS_TOKEN) {
        console.log('Signaling reconnection failed due to expired AccessToken!');
      } else if (error.code === CODE_RECONNECT_FAIL__ATTEMPTS_EXHAUST) {
        console.log('Signaling reconnection attempts exhausted!');
      } else if (error.code === CODE_RECONNECT_FAIL__TOO_LONG) {
        console.log('Signaling reconnection took too long!');
      } else {
        console.log(`Room ${room.name} is ended unexpected. Error: ${JSON.stringify(error, null, 2)}`)
      }
    };
    const closeRoomResources = () => {
      if (room) {
        room.disconnect();
        setRoom(undefined);
      }
    };

    //We are creating listeners, and those listener should be created only one time when the component is initiated only.
    //Listeners shouldn't be register multiple times, that's why we put it in this useEffect();
    room?.on("disconnected", onRoomEnd);

    // Follow this recommendation: https://www.twilio.com/docs/video/reconnection-states-and-events
    window.addEventListener("pagehide", closeRoomResources);
    window.addEventListener("beforeunload", closeRoomResources);
    return () => {
      window.removeEventListener("pagehide", closeRoomResources);
      window.removeEventListener("beforeunload", closeRoomResources);
      //Don't remove all listeners because other listeners could be subscribed by other React Components.
      room?.off("disconnected", onRoomEnd);
      closeRoomResources();
    };
  }, [room]);
  // Conversation Details: End ///////////////////////////////////////////////////////////////////////


  let authenticatedContent;
  if (loggedIn && conversationClient) {
    console.log(`Showing authenticatedContent. Room ${room?.sid}. Conversation: ${conversation?.conversation.sid}`)
    if (room && conversation) {
      // VideoCall Content
      authenticatedContent = <InCallScreen cachedConversation={conversation} room={room} setRoom={setRoom}/>
    } else {
      // ConversationContent
      authenticatedContent =
        <div className={'row bg-light'}>
          <div className={'col-3 conversations-list'}>
            <UserCreation localUserIdentity={localUserIdentity} onCreateNewUserCallback={onCreateNewUserCallback}/>
            <CallsReceiverController localParticipantIdentity={localUserIdentity} conversationClient={conversationClient}
                                     cachedConversation={conversation} setConversation={setConversation} room={room} setRoom={setRoom}/>
            {existingConversations.map((cachedConversation: CachedConversation) => (
              <ExistingConversation key={cachedConversation.conversation.sid} localParticipantIdentity={localUserIdentity}
                                    cachedConversation={cachedConversation} onSelectConversationCallback={onSwitchConversationCallback}/>
            ))}
            {potentialRemoteUsers.map((remoteUser: BeUser) => (
              <RemoteUser key={remoteUser.identity} user={remoteUser} onSelectUserCallback={onSwitchRemoteUserCallback}/>
            ))}
          </div>
          <div className={'col-9'}>
            {conversation &&
            <ConversationDetails localParticipantIdentity={localUserIdentity} cachedConversation={conversation}
                                 conversationClient={conversationClient}
                                 waitingRoom={waitingRoom} setWaitingRoom={setWaitingRoom} room={room} setRoom={setRoom}/>
            }
          </div>
        </div>
    }
  } else {
    authenticatedContent = undefined;
  }

  return (
    <>
      <ConversationStarter
        localUserIdentifier={localUserIdentity}
        loggedIn={loggedIn}
        conversationClient={conversationClient}
        onChangeLocalUserIdentifier={onChangeLocalParticipantIdentifier}
        onLogIn={onLogIn}
        onLogOut={onLogOut}
        isLoggingIn={isLoggingIn}
      />
      {authenticatedContent}
    </>
  );
};

export default ConversationPage;
