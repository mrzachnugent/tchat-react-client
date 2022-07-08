import { ChangeEvent, FC, useState, KeyboardEvent } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import { IUser } from '../types';
import { trpc } from '../utils/trpc';

export const ChatInput: FC<{
  user: IUser | null;
}> = (props) => {
  const { user } = props;

  const [text, setText] = useState('');
  const handleCurrentUserTyping = trpc.useMutation('tchat.whatchaTyping');
  const handleSendMessage = trpc.useMutation('tchat.sendMessage');

  function sendMessage(msg: string) {
    if (!user) return;
    handleSendMessage.mutate({
      message: msg,
      room: 'Main',
      user: {
        id: user.id,
        name: user.name,
        room: 'Main',
        avatarSrc: user.avatarSrc,
      },
    });
  }

  function handleTyping(input: string) {
    if (!user) return;
    handleCurrentUserTyping.mutate({
      text: input,
      isSharable: true,
      user: {
        id: user.id,
        name: user.name,
        room: 'Main',
        avatarSrc: user.avatarSrc,
      },
    });
  }

  function handleOnInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleTyping(e.target.value);
    setText(e.target.value);
  }

  function handleOnInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (!text.length) return;
      sendMessage(text);
      setText('');
    }
  }

  function handleOnSend() {
    if (!text.length) return;
    sendMessage(text);
    setText('');
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
