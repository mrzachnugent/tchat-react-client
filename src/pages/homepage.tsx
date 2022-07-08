import { Dispatch, FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ChatHeader,
  ChatInfo,
  ChatInput,
  Convos,
  MessageBoard,
  ThemeToggler,
} from '../components';
import { IRoom, IUser } from '../types';
import { trpc } from '../utils/trpc';

// https://dribbble.com/shots/18471582-Mengchat-Messanger-Dashboard-Concept

export const Homepage = () => {
  const [user, setUser] = useState<IUser | null>(null);

  const room = trpc.useQuery(['tchat.getChatByRoom', 'Main']);

  return (
    <Drawers
      otherUser={room.data?.users.filter((e) => e.id !== user?.id)[0]}
      user={user}
    >
      <div className='h-screen bg-base-300 flex items-center justify-center'>
        <Main>
          <div className='rounded-tl-xl rounded-bl-xl border-r-2 border-base-300 hidden md:flex flex-col px-3'>
            <Convos />
          </div>
          <div className='flex-1 bg-base-200 lg:rounded-r-none rounded-r-xl rounded-l-xl md:rounded-l-none overflow-hidden '>
            <div className='flex flex-col  h-full relative'>
              <ChatHeader
                user={user}
                otherUser={room.data?.users.filter((e) => e.id !== user?.id)[0]}
              />
              <div className='relative h-full '>
                <div className='flex flex-col justify-between '>
                  {user && <MessageBoard user={user} room={room.data} />}
                  <ChatInput user={user} />
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-tr-xl rounded-br-xl border-l-2 border-base-300 w-60 lg:flex flex-col items-center hidden px-4'>
            <ChatInfo
              otherUser={room.data?.users.filter((e) => e.id !== user?.id)[0]}
              user={user}
            />
          </div>
        </Main>
      </div>
      <PickUserModal room={room.data} user={user} setUser={setUser} />
    </Drawers>
  );
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

const Drawers: FC<{ children: ReactNode; otherUser: any; user: any }> = ({
  children,
  otherUser,
  user,
}) => {
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
          <Convos />
        </div>
      </div>
    </div>
  );
};

const PickUserModal: FC<{
  room?: IRoom;
  user: IUser | null;
  setUser: Dispatch<React.SetStateAction<IUser | null>>;
}> = (props) => {
  const { room, user, setUser } = props;
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
    const signedInUser = room.users[parseInt(selected)];
    setUser(signedInUser);
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
            Create a an account to <span className='text-3xl'>tCHAT</span>
          </h3>
          <div className='h-8' />
          <select
            onChange={(e) => {
              if (e.target.value !== 'default' && room?.users.length) {
                setSelected(e.target.value);
              }
            }}
            className='select select-bordered w-full max-w-xs'
            defaultValue={'default'}
          >
            <option value={'default'}>Select an Account</option>
            <option value={0}>
              {users?.length ? users[0].name : 'Loading...'}
            </option>
            <option value={1}>
              {users?.length ? users[1].name : 'Loading...'}
            </option>
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
