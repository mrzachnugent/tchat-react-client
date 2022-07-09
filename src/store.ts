import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { IMessages } from './types';

interface BearState {
  messages: IMessages;
}

const useStore = create<BearState>()(
  devtools((set) => ({
    messages: [],
  }))
);
