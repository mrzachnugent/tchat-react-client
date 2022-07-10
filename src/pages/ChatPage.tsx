import { FC, ReactNode } from 'react';
import {
  ChatHeader,
  ChatInfo,
  ChatInput,
  Convos,
  Message,
  ThemeToggler,
} from '../components';
import { OthersLiveTyping } from '../components/OthersLiveTyping';
import { useAppContext } from '../trpc/AppContext';
import { ChatProvider, useChat } from '../trpc/ChatContext';
import { LoginPage } from './LoginPage';

const DEMO_ROOM = 'Main';

export const ChatPage: FC = () => {
  const { currentUser, otherUser } = useAppContext();

  if (!currentUser || !otherUser) {
    return <LoginPage room={DEMO_ROOM} />;
  }
  return (
    <ChatProvider
      currentUser={currentUser}
      otherUser={otherUser}
      room={DEMO_ROOM}
    >
      <Main />
    </ChatProvider>
  );
};

const Main: FC = () => {
  const { currentUser, messages } = useChat();
  return (
    <Drawers>
      <div className='h-screen bg-base-300 flex items-center justify-center'>
        <Wrapper>
          <div className='rounded-tl-xl rounded-bl-xl border-r-2 border-base-300 hidden md:flex flex-col px-3'>
            <Convos />
          </div>
          <div className='flex-1 bg-base-200 lg:rounded-r-none rounded-r-xl rounded-l-xl md:rounded-l-none overflow-hidden '>
            <div className='flex flex-col  h-full relative'>
              <ChatHeader />
              <div className='relative h-full '>
                <div className='flex flex-col justify-between '>
                  <div className=' flex flex-col-reverse  pb-16 overflow-y-auto absolute  max-h-full  right-0 left-0 top-0'>
                    <OthersLiveTyping />
                    {messages.map((e, i) => (
                      <Message
                        key={e.id}
                        message={e}
                        isPreviousMessageSameUser={
                          e.user.id === messages[i - 1]?.user?.id
                        }
                        isFromCurrentUser={e.user.id === currentUser?.id}
                        isNextMessageSameUser={
                          e.user.id === messages[i + 1]?.user?.id
                        }
                      />
                    ))}
                  </div>

                  <ChatInput />
                </div>
              </div>
            </div>
          </div>
          <div className='rounded-tr-xl rounded-br-xl border-l-2 border-base-300 w-60 lg:flex flex-col items-center hidden px-4'>
            <ChatInfo />
          </div>
        </Wrapper>
      </div>
    </Drawers>
  );
};

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
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

const Drawers: FC<{
  children: ReactNode;
}> = ({ children }) => (
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
            <ChatInfo />
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
