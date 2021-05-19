import React, {ChangeEvent, FormEvent, MouseEvent, useEffect, useState} from "react";
import {Message} from "@twilio/conversations/lib/message";
import Client from "@twilio/conversations";
import './css/ConversationStarter.css';

export interface ConversationStarterProps {
  localUserIdentifier: string,
  loggedIn: boolean,
  conversationClient?: Client,
  onLogIn: (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => void,
  onLogOut: () => void,
  onChangeLocalUserIdentifier: (event: ChangeEvent<HTMLInputElement>) => void,
  isLoggingIn: boolean,
};

const ConversationStarter = ({
                               localUserIdentifier,
                               onChangeLocalUserIdentifier,
                               loggedIn,
                               conversationClient,
                               onLogIn,
                               onLogOut,
                               isLoggingIn,
                             }: ConversationStarterProps): JSX.Element => {
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);

  useEffect(() => {
    const listenMessageAdded = (addedMessage: Message) => {
      setNewMessagesCount(prevState => {
        console.log(`Receive new message ${addedMessage.body} from '${addedMessage.author}' in conversation '${addedMessage.conversation.uniqueName}'`)
        return prevState + 1;
      });
    }
    conversationClient?.on("messageAdded", listenMessageAdded);
    return () => {
      conversationClient?.off("messageAdded", listenMessageAdded);
      setNewMessagesCount(0);
    };
  }, [conversationClient]);

  const onAcknowledgedNewMessages = () => {
    setNewMessagesCount(0);
  }

  return (
    <div className={'row py-2 conversation-starter'}>
      <div className={'col-sm-3'}>
        <form onSubmit={onLogIn}>
          <div className="input-group">
            {!loggedIn &&
            <button onClick={onLogIn} type={"submit"} className="input-group-text button-group-input" id="basic-addon1" title={"Login"}>
              {!isLoggingIn && <i className="bi bi-box-arrow-in-right"></i>}
              {isLoggingIn && <span className="ps-2 spinner-border spinner-border-sm"></span>}
            </button>
            }
            {loggedIn &&
            <span onClick={onLogOut} className="input-group-text button-group-input" id="basic-addon1" title={"Log out"}>
              <i className="bi bi-box-arrow-left"></i>
            </span>
            }
            <input type={'input'} placeholder={`Your username, please?`} title={'Local User Identifier'}
                   value={localUserIdentifier}
                   disabled={loggedIn}
                   onChange={onChangeLocalUserIdentifier}
                   className={'form-control'} aria-label="Username" aria-describedby="basic-addon1"/>
          </div>
        </form>

      </div>

      {loggedIn &&
      <div className={'col-sm-9 messages-badge text-end '}>
        {newMessagesCount <= 0 && <i className="bi bi-envelope-fill align-middle"></i>}
        {newMessagesCount > 0 &&
        <i className="bi bi-envelope-open-fill align-middle" onClick={onAcknowledgedNewMessages}><span
            className={'messages-badge-text'}> {newMessagesCount}</span>
        </i>
        }
      </div>
      }
    </div>
  );
};

export default ConversationStarter;
