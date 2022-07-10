import { FC } from 'react';
import { HiChevronDown, HiPlus } from 'react-icons/hi';
import { useNotImplementedYet } from './NotImplementedContext';
import { useChat } from '../trpc/ChatContext';

export const ChatInfo: FC = () => {
  const { toggleNoWorkYet } = useNotImplementedYet();
  const { currentUser, otherUser } = useChat();
  return (
    <>
      <div className='h-8' />
      {currentUser && (
        <div className={`avatar ${otherUser?.isOnline && 'online'}`}>
          <div className='w-24 rounded-full'>
            <img src={otherUser?.avatarSrc} />
          </div>
        </div>
      )}
      <div className='h-4' />
      <p className='text-sm '>Direct Message</p>
      <div className='h-8' />
      <div className='w-full'>
        <div className='flex justify-between'>
          <p className='font-bold'>Members</p>
          <HiChevronDown size={24} />
        </div>
        <div className='h-4' />
        <button
          className='flex items-center justify-start btn btn-ghost hover:bg-transparent w-full'
          onClick={toggleNoWorkYet}
        >
          <span className='btn btn-circle btn-sm btn-primary'>
            <HiPlus size={18} />
          </span>
          <div className='w-2' />
          <p>Add members</p>
        </button>
      </div>
    </>
  );
};
