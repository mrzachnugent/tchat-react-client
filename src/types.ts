import { inferQueryOutput } from './utils/trpc';

export type IRoom = inferQueryOutput<'tchat.getChatByRoom'>;

export type IMessages = IRoom['messages'];

export type IUser = IRoom['users'][number];
