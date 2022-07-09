import { TRPCLink } from '@trpc/client';
import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { createReactQueryHooks } from '@trpc/react';
import { FC, ReactElement, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppRouter } from '../types';

const DEFAULT_CHAT_SERVER_HOST = '127.0.0.1:8080';

interface TChatProviderProps {
  children: ReactNode;
  host?: string;
  chatPathStartsWith?: string;
  myTrpcLink?: TRPCLink<any>;
}

export const trpc = createReactQueryHooks<AppRouter>();

export const TChatProvider: FC<TChatProviderProps> = (props): ReactElement => {
  const {
    children,
    myTrpcLink,
    host = DEFAULT_CHAT_SERVER_HOST,
    chatPathStartsWith = 'tchat.',
  } = props;
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
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
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export const useTChat = () => {};
