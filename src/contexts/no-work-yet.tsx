import { createContext, FC, ReactNode, useContext, useRef } from 'react';

interface INoWorkYetContext {
  toggleNoWorkYet(): void;
}

const NoWorkYetContext = createContext({} as INoWorkYetContext);

{
  /* <label for="my-modal" class="btn modal-button">open modal</label> */
}
export const NoWorkYetProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ref = useRef({} as HTMLInputElement);
  function toggleNoWorkYet() {
    ref.current.checked = !ref.current.checked;
  }
  return (
    <NoWorkYetContext.Provider value={{ toggleNoWorkYet }}>
      {children}
      <input type='checkbox' id='my-modal' className='modal-toggle' ref={ref} />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-2xl text-center'>
            Unfortunately it does not work yet!
          </h3>

          <div className='modal-action flex justify-center w-full'>
            <button onClick={toggleNoWorkYet} className='btn btn-wide'>
              OK
            </button>
          </div>
        </div>
      </div>
    </NoWorkYetContext.Provider>
  );
};

export const useNoWorkYet = () => {
  return useContext(NoWorkYetContext);
};
