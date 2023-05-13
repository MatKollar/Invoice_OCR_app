import { useState, useContext } from "react";
import OCRContext from "../../context/ocr-context";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CleanIcon from "@mui/icons-material/CleaningServices";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import SummaryIcon from "@mui/icons-material/List";
import { useStyles } from "./styles";
import { Typography } from "@mui/material";

const Tabbar = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const ocrCtx = useContext(OCRContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    ocrCtx.setActivePage(newValue);
  };

  return (
    <div className={classes.rootContainer}>
      <Tabs
        className={classes.tabsContainer}
        value={ocrCtx.activePage}
        onChange={handleChange}
      >
        <Tab
          sx={{ mx: 4, p: 2 }}
          label={
            <Typography>
              <FileUploadIcon />
              UPLOAD
            </Typography>
          }
        />
        <Tab
          sx={{ mx: 4, p: 2 }}
          label={
            <Typography>
              <CleanIcon />
              PREPROCESSING
            </Typography>
          }
        />
        <Tab
          sx={{ mx: 4, p: 2 }}
          label={
            <Typography>
              <EyeIcon />
              OCR
            </Typography>
          }
        />
        <Tab
          sx={{ mx: 4, p: 2 }}
          label={
            <Typography>
              <SummaryIcon />
              SUMMARY
            </Typography>
          }
        />
      </Tabs>
    </div>
  );
};

export default Tabbar;
