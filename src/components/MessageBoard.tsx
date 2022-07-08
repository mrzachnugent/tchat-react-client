import { FC, useEffect, useState } from 'react';
import { IUser, IMessages, IRoom } from '../types';
import { trpc } from '../utils/trpc';
import { HiHeart } from 'react-icons/hi';
import { MdReply } from 'react-icons/md';

export const MessageBoard: FC<{ user: IUser | null; room?: IRoom }> = (
  props
) => {
  const { user, room } = props;
  const [messages, setMessages] = useState<IMessages>([]);
  const utils = trpc.useContext();

  trpc.useSubscription(['tchat.messages', { room: 'Main' }], {
    onNext(data) {
      setMessages((prev) => [data, ...prev]);
    },
    onError(err) {
      console.error('tchat.messages Subscription error:', err);
      utils.invalidateQueries();
    },
  });
  const [typingUsers, setTypingUsers] = useState<{
    [key: string]: { name: string; text: string; src: string };
  }>({});

  useEffect(() => {
    if (!messages.length) {
      setMessages(room?.messages || []);
    }
  }, [room]);

  trpc.useSubscription(['tchat.whosTyping', { room: 'Main' }], {
    onNext(data) {
      setTypingUsers((prev) => ({
        ...prev,
        [data.user.id]: {
          name: data.user.name,
          text: data.text,
          src: data.user.avatarSrc,
        },
      }));
    },
    onError(err) {
      console.error('tchat.whosTyping Subscription error:', err);
      utils.invalidateQueries();
    },
  });

  return (
    <div className=' flex flex-col-reverse  pb-16 overflow-y-auto absolute  max-h-full  right-0 left-0 top-0'>
      <ShowOtherTyping user={user} typingUsers={typingUsers} />
      {messages.map((e, i) => (
        <div
          key={i}
          className={` message relative flex hover:bg-base-300  px-2 py-2 ${
            e.user.id === messages[i - 1]?.user?.id ? 'mb-0' : 'mb-1'
          } ${e.user.id === user?.id ? 'justify-end' : ''}`}
        >
          <div
            className={` hidden fade-in extra-info bg-base-100 border border-info rounded-full absolute top-2  ${
              e.user.id === user?.id ? 'left-10' : 'right-10'
            }`}
          >
            <div
              className={`tooltip ${
                i === messages.length - 1 ? 'tooltip-bottom' : ''
              }`}
              data-tip='Like'
            >
              <button className='w-9 h-9 flex justify-center items-center hover:bg-base-300  rounded-l-full'>
                <HiHeart className='active:scale-90 h-full w-full p-2.5' />
              </button>
            </div>
            <div
              className={`tooltip ${
                i === messages.length - 1 ? 'tooltip-bottom' : ''
              }`}
              data-tip='Reply'
            >
              <button className='w-9 h-9 flex justify-center items-center hover:bg-base-300  rounded-r-full'>
                <MdReply className='active:scale-90 h-full w-full p-2.5' />
              </button>
            </div>
          </div>
          <div className='flex' style={{ maxWidth: '90%' }}>
            <div className={` py-1 ${e.user.id === user?.id ? 'hidden' : ''}`}>
              <div className='avatar'>
                <div
                  className={`w-10  rounded-full  ${
                    e.user.id === messages[i + 1]?.user?.id ||
                    e.user.id === user?.id
                      ? 'h-0'
                      : 'h-10'
                  }`}
                >
                  <img
                    src={e.user.avatarSrc}
                    className={`w-10 h-10 rounded-full`}
                  />
                </div>
              </div>
            </div>
            <div className='w-2' />
            <div>
              <div
                className={`w-full pb-1 ${
                  e.user.id === messages[i + 1]?.user?.id ||
                  user?.id === e.user.id
                    ? 'hidden'
                    : ''
                }`}
              >
                <p className='text-xs'>{e.user.name}</p>
              </div>
              <div
                className={`px-4 py-1 relative rounded-xl ${
                  e.user.id === user?.id ? 'bg-primary ' : ' bg-accent'
                }`}
              >
                <span className='text-white '>{e.message}</span>
              </div>
              {!!Object.values(e.likes).length && (
                <div
                  className={
                    e.likes[e.user.id]
                      ? 'text-red-600 '
                      : 'text-current ' + 'absolute'
                  }
                >
                  <button
                    className=' -translate-y-1/2 active:scale-90 tooltip tooltip-bottom z-10'
                    data-tip={Object.values(e.likes).length}
                  >
                    <HiHeart
                      size={20}
                      className='bg-base-300 p-1 rounded-full '
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShowOtherTyping: FC<{
  user: IUser | null;
  typingUsers: { [key: string]: { name: string; text: string; src: string } };
}> = ({ typingUsers, user }) => (
  <>
    {Object.keys(typingUsers).some(
      (e) => typingUsers[e].text && e !== user?.id
    ) && (
      <div>
        {Object.keys(typingUsers).map(
          (e) =>
            e !== user?.id && (
              <div key={e} className='flex p-2 fadeInUp  '>
                <div className='avatar  '>
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
