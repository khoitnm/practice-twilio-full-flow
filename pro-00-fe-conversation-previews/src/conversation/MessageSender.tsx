import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import './css/MessageSender.css';
import CachedConversation from "./CachedConversation";

export interface MessageSenderProps {
  localParticipantIdentity: string,
  cachedConversation?: CachedConversation,
}

const MessageSender = ({localParticipantIdentity, cachedConversation}: MessageSenderProps): JSX.Element => {
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      //Clean up
      setInputMessage('');
    };
  }, []);

  const onChangeInputMessage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    cachedConversation?.conversation.typing();// Don't need to await here, just let it run async.
    console.log(`${localParticipantIdentity} is sending typing event...`)
    setInputMessage(event.target.value);
  }

  const onSendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!inputMessage?.trim()) return;
    // await beConversationService.sendMessage()
    await cachedConversation?.conversation.sendMessage(inputMessage);
    setInputMessage('');
  }

  const onUnimplementedFunction = () => {
    alert("This feature requires salary increment for SC 2 members.");
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