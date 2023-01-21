import React, { useState } from 'react';

const OCRContext = React.createContext({
  activePage: 0,
  originalImage: null,
  setActivePage: (activePage) => {},
  setOriginalImage: (image) => {},
});

export const OCRContextProvider = (props) => {
  const [activePage, setActivePage] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);

  const pageHandler = (activePage) => {
    setActivePage(activePage);
  };

  const contextValue = {
    activePage: activePage,
    originalImage: originalImage,
    setActivePage: pageHandler,
    setOriginalImage: setOriginalImage,
  };

  return (
    <OCRContext.Provider value={contextValue}>
      {props.children}
    </OCRContext.Provider>
  );
};

export default OCRContext;