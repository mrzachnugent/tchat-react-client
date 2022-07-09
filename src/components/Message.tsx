import { FC, memo, useState } from 'react';
import { IMessages, IUser } from '../types';
import { HiHeart } from 'react-icons/hi';
import { MdReply } from 'react-icons/md';
import { useNoWorkYet } from '../contexts/no-work-yet';
import { trpc } from '../trpc/useTChat';

interface MessageProps {
  message: IMessages[number];
  isPreviousMessageSameUser: boolean;
  isNextMessageSameUser: boolean;
  isFromCurrentUser: boolean;
  currentUser: IUser;
  otherUser: IUser | null;
}

export const Message: FC<MessageProps> = (props) => {
  const {
    message,
    currentUser,
    otherUser,
    isPreviousMessageSameUser,
    isFromCurrentUser,
    isNextMessageSameUser,
  } = props;
  const toggleLike = trpc.useMutation(['tchat.toggleLike']);

  function handleToggleLike() {
    toggleLike.mutate({
      messageId: message.id,
      room: 'Main',
      user: currentUser,
    });
  }
  return (
    <div
      className={`message hover:bg-base-300 relative flex transition-all  px-2 pt-2 ${
        isPreviousMessageSameUser ? 'mb-0' : 'mb-1'
      } ${isFromCurrentUser ? 'justify-end' : ''}`}
    >
      <div
        className={`flex flex-wrap ${
          isFromCurrentUser && 'flex-row-reverse'
        } items-end`}
        style={{ maxWidth: '90%' }}
      >
        <div className={` py-1 ${isFromCurrentUser && 'hidden'}`}>
          <div className={`avatar ${otherUser?.isOnline && 'online'}`}>
            <div
              className={`w-10  rounded-full  ${
                isNextMessageSameUser || isFromCurrentUser ? 'h-0' : 'h-10'
              }`}
            >
              <img
                src={message.user.avatarSrc}
                className={`w-10 h-10 rounded-full`}
              />
            </div>
          </div>
        </div>
        {!isFromCurrentUser && <div className='w-2' />}
        <div>
          <div
            className={` pb-1 ${
              isNextMessageSameUser || isFromCurrentUser ? 'hidden' : ''
            }`}
          >
            <p className='text-xs'>{message.user.name}</p>
          </div>
          <div
            className={`px-4 py-2 rounded-xl flex ${
              isFromCurrentUser ? 'bg-primary ' : ' bg-accent'
            }`}
          >
            <span className='text-white '>{message.message}</span>
          </div>
        </div>
        <div
          className={`w-full flex overflow-hidden ${
            isFromCurrentUser && 'flex-row-reverse'
          } `}
        >
          {!isFromCurrentUser && <div className='w-12' />}
          <ActionBar
            isFromCurrentUser={isFromCurrentUser}
            isLikedByMe={message.likes[currentUser.id]}
            numLikes={Object.keys(message.likes).length}
            handleToggleLike={handleToggleLike}
          />
        </div>
      </div>
    </div>
  );
};

interface ActionBarProps {
  isFromCurrentUser: boolean;
  isLikedByMe: boolean;
  numLikes: number;
  handleToggleLike(): void;
}

const ActionBar: FC<ActionBarProps> = ({
  isFromCurrentUser,
  isLikedByMe,
  numLikes,
  handleToggleLike,
}) => {
  return (
    <div
      className={`my-1 ${
        isLikedByMe || !!numLikes ? 'h-auto' : ' h-0'
      } flex action justify-end rounded-full   ${
        !isFromCurrentUser && ' flex-row-reverse'
      }`}
    >
      <div
        className={` flex ${isFromCurrentUser && 'flex-row-reverse'} 
        `}
      >
        <button
          className={`w-9 h-9 flex justify-center items-center hover:bg-base-200 bg-transparent  rounded-full
              ${isLikedByMe && 'text-red-500'} `}
          onClick={handleToggleLike}
        >
          <HiHeart className='active:scale-90 h-full w-full p-2.5' />
        </button>
        <div className='w-2' />
        <span className='flex items-center justify-center '>
          {!!numLikes && (
            <span className={`${isLikedByMe && 'text-red-500'}`}>
              {numLikes}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
