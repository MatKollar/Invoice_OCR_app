import { useContext } from "react";
import OCRContext from "../../context/ocr-context";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CleanIcon from "@mui/icons-material/CleaningServices";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import SummaryIcon from "@mui/icons-material/List";
import Grid from "@mui/material/Grid";
import { useStyles } from "./styles";
import { Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const tabList = [
  { label: "UPLOAD", icon: <FileUploadIcon sx={{ mr: 0.5 }} /> },
  { label: "PREPROCESSING", icon: <CleanIcon sx={{ mr: 0.5 }} /> },
  { label: "OCR", icon: <EyeIcon sx={{ mr: 0.5 }} /> },
  { label: "SUMMARY", icon: <SummaryIcon sx={{ mr: 0.5 }} /> },
];

const Tabbar = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    ocrCtx.setActivePage(newValue);
  };

  return (
    <Grid container className={classes.rootContainer}>
      <Grid item xs={12} container justifyContent="center" flexWrap="wrap">
        <Tabs
          className={classes.tabsContainer}
          value={ocrCtx.activePage}
          onChange={handleChange}
          variant="scrollable"
          centered
        >
          {tabList.map((tab, index) => (
            <Tab
              key={index}
              sx={{
                maxWidth: "100%",
                mx: { xs: 0, sm: 0.5, md: 1, lg: 2 },
                p: { xs: 0, sm: 0.5, md: 1, lg: 1.5 },
              }}
              label={
                <Typography sx={{ display: "flex", fontFamily: "Oxanium, cursive" }}>
                  {tab.icon}
                  <div className={classes.text}>{tab.label}</div>
                </Typography>
              }
            />
          ))}
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default Tabbar;
