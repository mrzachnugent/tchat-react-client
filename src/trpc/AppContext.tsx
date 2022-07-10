import { TRPCLink } from '@trpc/client';
import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { createReactQueryHooks } from '@trpc/react';
import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppRouter, IUser } from '../types';

export type keysOfRooms = 'Main';

interface IAppContext {
  currentUser: IUser | null;
  setCurrentUser: Dispatch<React.SetStateAction<IUser | null>>;
  otherUser: IUser | null;
  setOtherUser: Dispatch<React.SetStateAction<IUser | null>>;
}

const AppContext = createContext({} as IAppContext);

interface AppProviderProps {
  children: ReactNode;
  host: string;
  chatPathStartsWith: string;
  myTrpcLink?: TRPCLink<any>;
}

/**
 * `AppRouter` comes from the fastify server with tRPC and web socketss
 * If  you combine another tRPC routers: 
 * 1. Replace AppRouter with `combinedServer` for typing only example:
  const combinedServer = trpc 
   .router<any>() 
   .merge('tchat.', tchat.appRouter) 
   .merge('yourVeryOwn.', yourVeryOwn.appRouter); 
   * 2. Pass you own httpLink or httpBatchLink as the `myTrpcLink` to `AppProvider`
 */
export const trpc = createReactQueryHooks<AppRouter>();

export const AppProvider: FC<AppProviderProps> = (props): ReactElement => {
  const { children, myTrpcLink, host, chatPathStartsWith } = props;
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(
    createTrpcClientState(trpc, chatPathStartsWith, host, myTrpcLink)
  );

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [otherUser, setOtherUser] = useState<IUser | null>(null);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider
          value={{
            currentUser,
            setCurrentUser,
            otherUser,
            setOtherUser,
          }}
        >
          {children}
        </AppContext.Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

type trpcType = ReturnType<typeof createReactQueryHooks>;

const createTrpcClientState =
  (
    trpc: trpcType,
    chatPathStartsWith: string,
    host: string,
    myTrpcLink?: TRPCLink<any>
  ) =>
  () =>
    trpc.createClient({
      links: [
        splitLink(
          myTrpcLink
            ? {
                condition(op) {
                  return op.path.startsWith(chatPathStartsWith);
                },
                true: splitLink({
                  condition(op) {
                    return op.type === 'subscription';
                  },
                  true: wsLink({
                    client: createWSClient({ url: `ws://${host}/trpc` }),
                  }),
                  false: httpLink({ url: `http://${host}/trpc` }),
                }),
                false: myTrpcLink,
              }
            : {
                condition(op) {
                  return op.type === 'subscription';
                },
                true: wsLink({
                  client: createWSClient({ url: `ws://${host}/trpc` }),
                }),
                false: httpLink({ url: `http://${host}/trpc` }),
              }
        ),
      ],
    });
