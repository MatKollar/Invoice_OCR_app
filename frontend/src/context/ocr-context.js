import React, { useState } from 'react';

const OCRContext = React.createContext({
  activePage: 0,
  originalImage: null,
  actualImage: null,
  setActivePage: (activePage) => {},
  setOriginalImage: (image) => {},
  setActualImage: (image) => {},
});

export const OCRContextProvider = (props) => {
  const [activePage, setActivePage] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const [actualImage, setActualImage] = useState(null);

  const pageHandler = (activePage) => {
    setActivePage(activePage);
  };

  const contextValue = {
    activePage: activePage,
    originalImage: originalImage,
    actualImage: actualImage,
    setActivePage: pageHandler,
    setOriginalImage: setOriginalImage,
    setActualImage: setActualImage,
  };

  return (
    <OCRContext.Provider value={contextValue}>
      {props.children}
    </OCRContext.Provider>
  );
};

export default OCRContext;