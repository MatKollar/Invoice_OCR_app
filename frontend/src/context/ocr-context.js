import React, { useState } from "react";

const OCRContext = React.createContext({
  activePage: 0,
  originalImage: null,
  actualImage: null,
  textResult: null,
  extractedData: null,
  file: null,
  invoiceId: null,
  isInvoice: true,
  setActivePage: (activePage) => {},
  setOriginalImage: (image) => {},
  setActualImage: (image) => {},
  setTextResult: (text) => {},
  setExtractedData: (data) => {},
  setFile: (file) => {},
  setInvoiceId: (invoice_id) => {},
  setIsInvoice: (isInvoice) => {},
});

export const OCRContextProvider = (props) => {
  const [activePage, setActivePage] = useState(0);
  const [originalImage, setOriginalImage] = useState(null);
  const [actualImage, setActualImage] = useState(null);
  const [textResult, setTextResult] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [file, setFile] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [isInvoice, setIsInvoice] = useState(true);

  const pageHandler = (activePage) => {
    setActivePage(activePage);
  };

  const contextValue = {
    activePage: activePage,
    originalImage: originalImage,
    actualImage: actualImage,
    textResult: textResult,
    extractedData: extractedData,
    file: file,
    invoiceId: invoiceId,
    isInvoice: isInvoice,
    setActivePage: pageHandler,
    setOriginalImage: setOriginalImage,
    setActualImage: setActualImage,
    setTextResult: setTextResult,
    setExtractedData: setExtractedData,
    setFile: setFile,
    setInvoiceId: setInvoiceId,
    setIsInvoice: setIsInvoice,
  };

  return <OCRContext.Provider value={contextValue}>{props.children}</OCRContext.Provider>;
};

export default OCRContext;
