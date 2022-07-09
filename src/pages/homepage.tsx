import { Dispatch, FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ChatHeader,
  ChatInfo,
  ChatInput,
  Convos,
  Message,
  ThemeToggler,
} from '../components';
import { trpc } from '../trpc/useTChat';
import { IMessages, IRoom, IUser } from '../types';

// https://dribbble.com/shots/18471582-Mengchat-Messanger-Dashboard-Concept

export const Homepage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [otherUser, setOtherUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessages>([]);
  const utils = trpc.useContext();
  const room = trpc.useQuery(['tchat.getChatByRoom', 'Main']);
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

  trpc.useSubscription(['tchat.messageEdit', { room: 'Main' }], {
    onNext(data) {
      setMessages((prev) => {
        const index = prev.findIndex((msg) => msg.id === data.id);
        const copy = [...prev];
        copy[index] = data;
        return copy;
      });
    },
    onError(err) {
      console.error('tchat.messages Subscription error:', err);
      utils.invalidateQueries();
    },
  });

  useEffect(() => {
    if (!messages.length) {
      setMessages(room.data?.messages || []);
    }
  }, [room.data]);

  return (
    <Drawers otherUser={otherUser} user={user}>
      <div className='h-screen bg-base-300 flex items-center justify-center'>
        {user && otherUser && (
          <Test
            user={user}
            otherUser={otherUser}
            setOtherUser={setOtherUser}
            setUser={setUser}
          />
        )}
        <Main>
          <div className='rounded-tl-xl rounded-bl-xl border-r-2 border-base-300 hidden md:flex flex-col px-3'>
            {user && <Convos user={user} />}
          </div>
          <div className='flex-1 bg-base-200 lg:rounded-r-none rounded-r-xl rounded-l-xl md:rounded-l-none overflow-hidden '>
            <div className='flex flex-col  h-full relative'>
              <ChatHeader user={user} otherUser={otherUser} />
              <div className='relative h-full '>
                <div className='flex flex-col justify-between '>
                  <div className=' flex flex-col-reverse  pb-16 overflow-y-auto absolute  max-h-full  right-0 left-0 top-0'>
                    <ShowOtherTyping user={user} typingUsers={typingUsers} />
                    {user &&
                      messages.map((e, i) => (
                        <Message
                          key={(Math.random() + 1)
                            .toString(36)
                            .substring(7)
                            .toString()}
                          currentUser={user}
                          otherUser={otherUser}
                          message={e}
                          isPreviousMessageSameUser={
                            e.user.id === messages[i - 1]?.user?.id
                          }
                          isFromCurrentUser={e.user.id === user?.id}
                          isNextMessageSameUser={
                            e.user.id === messages[i + 1]?.user?.id
                          }
                        />
                      ))}
                  </div>

                  <ChatInput user={user} />
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-tr-xl rounded-br-xl border-l-2 border-base-300 w-60 lg:flex flex-col items-center hidden px-4'>
            <ChatInfo otherUser={otherUser} user={user} />
          </div>
        </Main>
      </div>
      <PickUserModal
        room={room.data}
        user={user}
        setUser={setUser}
        setOtherUser={setOtherUser}
      />
    </Drawers>
  );
};

const Test = ({
  user,
  setUser,
  setOtherUser,
  otherUser,
}: {
  user: IUser;
  setUser: any;
  setOtherUser: any;
  otherUser: IUser;
}) => {
  const utils = trpc.useContext();
  const login = trpc.useMutation(['tchat.login']);
  trpc.useSubscription(['tchat.whosOnline', { room: 'Main' }], {
    onNext(data) {
      if (data.id === user?.id) {
        setUser(data);
      } else if (data.id === otherUser?.id) {
        setOtherUser(data);
      }
    },
    onError(err) {
      console.error('tchat.messages Subscription error:', err);
      utils.invalidateQueries();
    },
  });

  useEffect(() => {
    login.mutate({ user });
  }, []);
  return <div />;
};

const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main
      className='rounded-xl bg-base-100 shadow-xl flex justify-between'
      style={{
        width: 'calc(100% - 2em)',
        height: 'calc(100% - 2em)',
        maxHeight: '900px',
        maxWidth: '1400px',
      }}
    >
      {children}
    </main>
  );
};

const Drawers: FC<{
  children: ReactNode;
  otherUser: IUser | null;
  user: IUser | null;
}> = ({ children, otherUser, user }) => {
  return (
    <div className='drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>
        <div className='drawer drawer-end'>
          <input id='my-drawer-4' type='checkbox' className='drawer-toggle' />
          <div className='drawer-content'>{children}</div>
          <div className='drawer-side'>
            <label htmlFor='my-drawer-4' className='drawer-overlay'></label>
            <div
              className='menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content flex flex-col items-center'
              style={{ maxWidth: '85%' }}
            >
              <div className='flex w-full justify-end'>
                <ThemeToggler alwaysShow />
              </div>
              <ChatInfo otherUser={otherUser} user={user} />
            </div>
          </div>
        </div>
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <div
          className='menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content flex flex-col '
          style={{ maxWidth: '85%' }}
        >
          {user && <Convos user={user} />}
        </div>
      </div>
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

const PickUserModal: FC<{
  room?: IRoom;
  user: IUser | null;
  setUser: Dispatch<React.SetStateAction<IUser | null>>;
  setOtherUser: Dispatch<React.SetStateAction<IUser | null>>;
}> = (props) => {
  const { room, user, setUser, setOtherUser } = props;
  const users = room?.users;
  const [selected, setSelected] = useState('');
  const modelRef = useRef({} as HTMLInputElement);

  useEffect(() => {
    if (modelRef.current && !user) {
      modelRef.current.checked = true;
    }
  }, []);

  async function handleSignUp() {
    if (!selected.length || !room) return;
    const signedInUser = room.users[selected];
    setUser(signedInUser);
    setOtherUser(selected === '0' ? room.users['1'] : room.users['0']);
    modelRef.current.checked = false;
  }
  return (
    <>
      <input
        type='checkbox'
        ref={modelRef}
        id='my-modal'
        className='modal-toggle'
      />
      <div className='modal'>
        <div
          className='bg-base-200 py-12 px-4 shadow-lg rounded-2xl text-center'
          style={{ maxWidth: '90%' }}
        >
          <h3 className='font-bold text-xl w-60'>
            Select an account to <span className='text-3xl'>tCHAT</span>
          </h3>
          <div className='h-8' />
          <select
            onChange={(e) => {
              if (e.target.value !== 'default' && users) {
                setSelected(e.target.value);
              }
            }}
            className='select select-bordered w-full max-w-xs'
            defaultValue={'default'}
          >
            <option value={'default'}>Select an Account</option>
            <option value={0}>{users ? users['0'].name : 'Loading...'}</option>
            <option value={1}>{users ? users['1'].name : 'Loading...'}</option>
          </select>
          <div className='h-4' />
          <button className='btn w-full' onClick={handleSignUp}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
