import { TRPCLink } from '@trpc/client';
import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { FC, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppRouter, trpc } from './utils/trpc';

const HOST = '127.0.0.1:8080';

export const TChatProvider: FC<{
  children: ReactNode;
  myTrpcLink?: TRPCLink<any>;
}> = ({ children, myTrpcLink }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink(
          myTrpcLink
            ? {
                condition(op) {
                  return op.path.startsWith('tchat.');
                },
                true: splitLink({
                  condition(op) {
                    return op.type === 'subscription';
                  },
                  true: wsLink<AppRouter>({
                    client: createWSClient({ url: `ws://${HOST}/trpc` }),
                  }),
                  false: httpLink<AppRouter>({ url: `http://${HOST}/trpc` }),
                }),
                false: myTrpcLink,
              }
            : {
                condition(op) {
                  return op.type === 'subscription';
                },
                true: wsLink<AppRouter>({
                  client: createWSClient({ url: `ws://${HOST}/trpc` }),
                }),
                false: httpLink<AppRouter>({ url: `http://${HOST}/trpc` }),
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
