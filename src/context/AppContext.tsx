import React, { useState, createContext, useContext } from 'react';
import gsheetConnector from '../samples/gsheet-connector.json';

type ContextProps = {
    state: any;
    setState?: (a: any) => void;
    connectors?: any[];
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<Partial<ContextProps>>({});

export const AppContextProvider = ({children}: AppContextProps) => {
  const [state, setState] = useState({})
  const connectors = [
    gsheetConnector
  ]

  return (
    <AppContext.Provider value={{ 
      state,
      setState,
      connectors
    }}>
      {children}
    </AppContext.Provider>
  )
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;