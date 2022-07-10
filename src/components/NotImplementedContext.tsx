import { createContext, FC, ReactNode, useContext, useRef } from 'react';

interface INotImplementedContext {
  toggleNoWorkYet(): void;
}

const NotImplementedContext = createContext({} as INotImplementedContext);

/**
 * Wraps app with potential modal
 * Provides function to open modal exaplining that the feature is not implemented
 */
export const NotImplementedFeaturesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ref = useRef({} as HTMLInputElement);
  function toggleNoWorkYet() {
    ref.current.checked = !ref.current.checked;
  }
  return (
    <NotImplementedContext.Provider value={{ toggleNoWorkYet }}>
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
    </NotImplementedContext.Provider>
  );
};

export const useNotImplementedYet = () => {
  return useContext(NotImplementedContext);
};
