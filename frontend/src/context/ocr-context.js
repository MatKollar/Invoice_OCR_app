import React, { useState } from 'react';

const OCRContext = React.createContext({
  activePage: 0,
  originalImage: null,
  actualImage: null,
  textResult: null,
  setActivePage: (activePage) => {},
  setOriginalImage: (image) => {},
  setActualImage: (image) => {},
  setTextResult: (text) => {},
});

export const OCRContextProvider = (props) => {
  const [activePage, setActivePage] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const [actualImage, setActualImage] = useState(null);
  const [textResult, setTextResult] = useState(null);

  const pageHandler = (activePage) => {
    setActivePage(activePage);
  };

  const contextValue = {
    activePage: activePage,
    originalImage: originalImage,
    actualImage: actualImage,
    textResult: textResult,
    setActivePage: pageHandler,
    setOriginalImage: setOriginalImage,
    setActualImage: setActualImage,
    setTextResult: setTextResult,
  };

  return (
    <OCRContext.Provider value={contextValue}>
      {props.children}
    </OCRContext.Provider>
  );
};

export default OCRContext;