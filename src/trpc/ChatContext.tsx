import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { IUser, IMessages } from '../types';
import { useAppContext, trpc, keysOfRooms } from './AppContext';

interface IChatContext {
  logout(): void;
  toggleLike(message: IMessages[number]): void;
  sendMessage(msg: string): void;
  handleTyping(input: string): void;
  currentUser: IUser;
  otherUser: IUser;
  messages: IMessages;
  setMessages: Dispatch<React.SetStateAction<IMessages>>;
  typingUsers: {
    [key: string]: {
      name: string;
      text: string;
      src: string;
    };
  };
}

const ChatContext = createContext({} as IChatContext);

interface ChatProviderProps {
  children: ReactNode;
  room: keysOfRooms;
  currentUser: IUser;
  otherUser: IUser;
}

export const ChatProvider: FC<ChatProviderProps> = (props) => {
  const { children, currentUser, otherUser, room } = props;
  const { setCurrentUser, setOtherUser } = useAppContext();

  const [messages, setMessages] = useState<IMessages>([]);
  const [typingUsers, setTypingUsers] = useState<{
    [key: string]: { name: string; text: string; src: string };
  }>({});

  const handleCurrentUserTyping = trpc.useMutation('tchat.whatchaTyping');
  const handleSendMessage = trpc.useMutation('tchat.sendMessage');
  const tcpcToggleLike = trpc.useMutation(['tchat.toggleLike']);
  const trpcLogout = trpc.useMutation(['tchat.logout']);
  const utils = trpc.useContext();

  trpc.useSubscription(['tchat.whosOnline', { room }], {
    onNext(data) {
      if (data.id === currentUser?.id) {
        setCurrentUser(data);
      } else if (data.id === otherUser?.id) {
        setOtherUser(data);
      }
    },
    onError(err) {
      console.error('tchat.messages Subscription error:', err);
      utils.invalidateQueries();
    },
  });

  trpc.useSubscription(['tchat.messages', { room, userId: currentUser.id }], {
    onNext(data) {
      setMessages((prev) => [data, ...prev]); // adds new msg to begging of array since displaying in flex-col-reverse
    },
    onError(err) {
      console.error('tchat.messages Subscription error:', err);
      utils.invalidateQueries();
    },
  });

  trpc.useSubscription(
    ['tchat.messageEdit', { room, userId: currentUser.id }],
    {
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
    }
  );

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

  const sendMessage = (msg: string) => {
    handleSendMessage.mutate({
      message: msg,
      room: 'Main',
      user: {
        id: currentUser.id,
        name: currentUser.name,
        room: 'Main',
        avatarSrc: currentUser.avatarSrc,
        isOnline: true,
      },
    });
  };

  const handleTyping = (input: string) => {
    handleCurrentUserTyping.mutate({
      text: input,
      isSharable: true,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        room: 'Main',
        avatarSrc: currentUser.avatarSrc,
        isOnline: true,
      },
    });
  };

  const toggleLike = (message: IMessages[number]) => {
    tcpcToggleLike.mutate({
      messageId: message.id,
      room: 'Main',
      user: currentUser,
    });
  };

  const logout = () => {
    trpcLogout.mutate({ user: currentUser });
  };

  const value = {
    currentUser,
    otherUser,
    logout,
    toggleLike,
    sendMessage,
    handleTyping,
    messages,
    setMessages,
    typingUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
