import { IUser } from '../types';
import { keysOfRooms, trpc, useAppContext } from './AppContext';

/**
 * For example uses only.
 */
export const useLogin = () => {
  const { setCurrentUser, setOtherUser } = useAppContext();
  const trpcLogin = trpc.useMutation(['tchat.login']);

  const login = async (user: IUser, room: keysOfRooms) => {
    setCurrentUser(user);
    const roomInfo = await trpcLogin.mutateAsync({ user, room });
    const otherUserId = Object.keys(roomInfo.users).find(
      (e) => roomInfo.users[e].id !== user.id
    );
    if (otherUserId) {
      setOtherUser(roomInfo.users[otherUserId]);
    }
  };

  return { login };
};
