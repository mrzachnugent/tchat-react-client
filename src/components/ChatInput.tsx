import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import { useChat } from '../trpc/ChatContext';

export const ChatInput: FC = () => {
  const { handleTyping, sendMessage } = useChat();
  const [text, setText] = useState('');

  function handleOnInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleTyping(e.target.value);
    setText(e.target.value);
  }

  function handleOnSend() {
    if (!text.length) return;
    sendMessage(text);
    setText('');
  }

  function handleOnInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleOnSend();
    }
  }

  return (
    <div className='absolute bottom-0 left-0 right-0 z-10'>
      <div className='border-t-2 border-base-300 bg-base-100 h-16 flex justify-center items-center px-3 py-2  relative '>
        <div className='w-full h-full '>
          <input
            className='bg-base-300 w-full h-full rounded-3xl flex items-center pl-8 pr-20 focus:outline-sky-200'
            placeholder='Type something...'
            value={text}
            onChange={handleOnInputChange}
            onKeyDown={handleOnInputKeyDown}
          />
          <button
            className='active:scale-90 w-20 rounded-r-3xl absolute top-0 right-0 bottom-0 flex justify-center items-center focus:outline-sky-200'
            onClick={handleOnSend}
          >
            <HiPaperAirplane size={24} className='rotate-45' />
          </button>
        </div>
      </div>
    </div>
  );
};
