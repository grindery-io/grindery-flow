import React, { useState, createContext, useContext } from 'react'

type ContextProps = {
    state: any;
    setState?: (a: any) => void;
};

type AppContextProps = {
  children: React.ReactNode;
}

export const AppContext = createContext<Partial<ContextProps>>({})

export const AppContextProvider = ({children}: AppContextProps) => {
  const [state, setState] = useState({})

  return (
    <AppContext.Provider value={{ 
      state,
      setState
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;