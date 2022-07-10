import { FC } from 'react';
import { useChat } from '../trpc/ChatContext';

export const OthersLiveTyping: FC = () => {
  const { currentUser, typingUsers } = useChat();
  return (
    <>
      {Object.keys(typingUsers).some(
        (e) => typingUsers[e].text && e !== currentUser?.id
      ) && (
        <div>
          {Object.keys(typingUsers).map(
            (e) =>
              e !== currentUser?.id && (
                <div key={e} className='flex p-2 fadeInUp  '>
                  <div className={`avatar`}>
                    <div className='w-8 h-8 rounded-full pulsing-border '>
                      <img src={typingUsers[e].src} />
                    </div>
                  </div>
                  <div className='w-2' />
                  <div className='bg-base-300 flex flex-wrap items-center rounded-xl p-2 shadow'>
                    <p className='text-sm '>
                      <span className='font-bold'>is typing:</span>{' '}
                      {typingUsers[e].text}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </>
  );
};
