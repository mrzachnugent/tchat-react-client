import { FC, useState } from 'react';
import { keysOfRooms, trpc } from '../trpc/AppContext';
import { useLogin } from '../trpc/useLogin';

export const LoginPage: FC<{ room: keysOfRooms }> = (props) => {
  const { room } = props;
  const [selected, setSelected] = useState('');
  const { login } = useLogin();
  const currentRoom = trpc.useQuery(['tchat.getChatByRoom', room]);
  const users = currentRoom.data?.users;

  function handleSignUp() {
    if (!selected.length || !users) return;
    login(users[selected], room);
  }

  return (
    <div className='hero min-h-screen bg-base-300'>
      <div
        className='bg-base-200 py-12 px-8 w-80 shadow-lg rounded-2xl text-center'
        style={{ maxWidth: '90%' }}
      >
        <h3 className='font-bold text-3xl'>tCHAT</h3>
        <div className='h-8' />
        <select
          onChange={(e) => {
            if (e.target.value !== 'default' && users) {
              setSelected(e.target.value);
            }
          }}
          className='select select-bordered w-full max-w-xs'
          defaultValue={'default'}
        >
          <option value={'default'}>Select an Account</option>
          <option value={0}>{users ? users['0'].name : 'Loading...'}</option>
          <option value={1}>{users ? users['1'].name : 'Loading...'}</option>
        </select>
        <div className='h-4' />
        <button className='btn w-full' onClick={handleSignUp}>
          Submit
        </button>
      </div>
    </div>
  );
};
