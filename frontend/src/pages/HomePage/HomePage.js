import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import httpRequest from "../../httpRequest";
import OCRContext from "../../context/ocr-context";
import userContext from "../../context/user-context";
import AppLayout from "../../components/AppLayout/AppLayout";
import Tabbar from "../../components/Tabbar/Tabbar";
import UploadCard from "../../components/UploadCard/UploadCard";
import PreprocessingCard from "../../components/PreprocessingCard/PreprocessingCard";
import OCRCard from "../../components/OCRCard/OCRCard";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import { useStyles } from "./styles";

const HomePage = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const userCtx = useContext(userContext);
  const [userName, setUserName] = useState();
  const [activePage, setActivePage] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpRequest.get(`${process.env.REACT_APP_BACKEND_URL}/@me`);
        userCtx.setUserName(resp.data.name);
        userCtx.setEmail(resp.data.email);
        userCtx.setRole(resp.data.role);
        setUserName(resp.data.name);
      } catch (error) {
        enqueueSnackbar("Not authenticated", { variant: "error" });
        window.location.href = "/login";
      }
    })();
  }, [userCtx, enqueueSnackbar]);

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
          {activePage === 3 && <SummaryCard />}
          <canvas className={classes.invoice} id="output" />
        </div>
      </AppLayout>
    </>
  );
};

export default HomePage;
