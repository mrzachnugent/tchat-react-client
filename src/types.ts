import { AppRouter as FastifyWsAppRouter } from '../../fastify-ws/src/trpc';
import type { inferProcedureOutput } from '@trpc/server';

export type AppRouter = FastifyWsAppRouter;

type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> =
  inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;

export type IRoom = inferQueryOutput<'tchat.getChatByRoom'>;

export type IMessages = IRoom['messages'];

export type IUser = IRoom['users'][number];
