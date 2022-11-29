import React, { useState } from 'react';

const OCRContext = React.createContext({
  activePage: 0,
  setActivePage: (activePage) => {},
});

export const OCRContextProvider = (props) => {
  const [activePage, setActivePage] = useState(0);

  const pageHandler = (activePage) => {
    setActivePage(activePage);
  };

  const contextValue = {
    activePage: activePage,
    setActivePage: pageHandler,
  };

  return (
    <OCRContext.Provider value={contextValue}>
      {props.children}
    </OCRContext.Provider>
  );
};

export default OCRContext;