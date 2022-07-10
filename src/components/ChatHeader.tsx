import { FC } from 'react';
import { HiInformationCircle, HiMenuAlt2 } from 'react-icons/hi';
import { useChat } from '../trpc/ChatContext';
import { ThemeToggler } from './ThemeToggler';

export const ChatHeader: FC = () => {
  const { otherUser } = useChat();
  return (
    <div className='py-2 border-b-2 border-base-300 bg-base-100 flex justify-between items-center md:px-4 '>
      <label
        htmlFor='my-drawer'
        className='btn btn-ghost drawer-button md:hidden hover:bg-transparent'
      >
        <HiMenuAlt2 size={24} />
      </label>

      <div className='flex'>
        <div className={`avatar ${otherUser?.isOnline && 'online'}`}>
          <div className='w-10 h-10 rounded-full bg-primary'>
            <img src={otherUser?.avatarSrc} />
          </div>
        </div>
        <div className='w-2' />

        <div className='flex flex-col justify-center'>
          <p className='normal-case '>{otherUser?.name}</p>
        </div>
      </div>

      <ThemeToggler />
      <label
        htmlFor='my-drawer-4'
        className='drawer-button btn btn-ghost lg:hidden hover:bg-transparent'
      >
        <HiInformationCircle size={24} />
      </label>
    </div>
  );
};
