import { useContext, useEffect, useState } from "react";
import axios from "axios";
import httpClient from "../../httpClient";

import OCRContext from "../../context/ocr-context";
import AppLayout from "../../components/AppLayout/AppLayout";
import Tabbar from "../../components/Tabbar/Tabbar";
import UploadCard from "../../components/UploadCard/UploadCard";

import { useStyles } from "./styles";
import PreprocessingCard from "../../components/PreprocessingCard/PreprocessingCard";
import OCRCard from "../../components/OCRCard/OCRCard";

const HomePage = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("http://localhost:5000/@me");
        console.log(resp.data);
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  function getData() {
    axios({
      method: "GET",
      url: "http://localhost:5000/hello",
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    setActivePage(ocrCtx.activePage);
    getData();
  }, [ocrCtx]);

  return (
    <>
      <AppLayout>
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
