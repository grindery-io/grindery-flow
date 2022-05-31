import React from 'react';
import AppHeader from './components/AppHeader';
import AppContextProvider from './context/AppContext';

function App() {
  return (
    <AppContextProvider>
      <div className="app">
        <AppHeader />
      </div>
    </AppContextProvider>
  );
}

export default App;
