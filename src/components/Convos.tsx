import { HiOutlinePencilAlt } from 'react-icons/hi';

export const Convos = () => (
  <>
    <div className='h-16 flex justify-between items-center  py-4'>
      <p className='font-bold normal-case text-2xl text-inherit'>Convos</p>
      <button className='btn btn-ghost btn-circle'>
        <HiOutlinePencilAlt size={24} className='opacity-90' />
      </button>
    </div>

    <div className='form-control'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search…'
          className='input input-bordered w-full'
        />
        <button className=' absolute right-0 bottom-0 top-0 w-12 flex justify-center items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      </div>
    </div>
  </>
);
