import { useContext, useEffect, useState } from "react";

import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
import AppLayout from "../../components/AppLayout/AppLayout";
import Tabbar from "../../components/Tabbar/Tabbar";
import UploadCard from "../../components/UploadCard/UploadCard";
import PreprocessingCard from "../../components/PreprocessingCard/PreprocessingCard";
import OCRCard from "../../components/OCRCard/OCRCard";
import { useStyles } from "./styles";

const HomePage = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [userName, setUserName] = useState();
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get("http://localhost:5000/@me");
        console.log(resp.data.name);
        setUserName(resp.data.name);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  useEffect(() => {
    setActivePage(ocrCtx.activePage);
  }, [ocrCtx]);

  return (
    <>
      <AppLayout userName={userName}>
        <Tabbar />
        <div className={classes.content}>
          {activePage === 0 && <UploadCard />}
          {activePage === 1 && <PreprocessingCard />}
          {activePage === 2 && <OCRCard />}
          <canvas className={classes.invoice} id="output" />
        </div>
      </AppLayout>
    </>
  );
};

export default HomePage;
