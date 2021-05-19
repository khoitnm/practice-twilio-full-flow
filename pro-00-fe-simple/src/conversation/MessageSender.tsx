import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Conversation} from "@twilio/conversations/lib/conversation";
import './css/MessageSender.css';

export interface MessageSenderProps {
  localParticipantIdentity: string,
  conversation?: Conversation,
}

const MessageSender = ({localParticipantIdentity, conversation}: MessageSenderProps): JSX.Element => {
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      //Clean up
      setInputMessage('');
    };
  }, []);

  const onChangeInputMessage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    conversation?.typing();// Don't need to await here, just let it run async.
    console.log(`${localParticipantIdentity} is sending typing event...`)
    setInputMessage(event.target.value);
  }

  const onSendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!inputMessage?.trim()) return;
    await conversation?.sendMessage(inputMessage);
    setInputMessage('');
  }

  const onUnimplementedFunction = () => {
    alert("Need to promote Kevin to have this feature.");
  }

  return (
    <form onSubmit={onSendMessage}>
      <div className={'row new-message-editor-input'}>
        <div className={'col-12'}>
          <input type={"text"} className="form-control" aria-label="With textarea" value={inputMessage} onChange={onChangeInputMessage}
                 placeholder={'Type new message'}/>
        </div>
      </div>
      <div className={'row new-message-editor-buttons'}>
        <div className={'col-9'}>
          {/*TODO*/}
          <button type={'button'} className="message-editor-button" onClick={onUnimplementedFunction}><i className="bi bi-image"></i></button>
          <button type={'button'} className="message-editor-button" onClick={onUnimplementedFunction}><i className="bi bi-paperclip"></i></button>
        </div>
        <div className={'col-3 text-end'}>
          <button type={"submit"} className="message-editor-button"><i className="bi bi-chevron-right"></i></button>
        </div>
      </div>
    </form>
  );
};

export default MessageSender;