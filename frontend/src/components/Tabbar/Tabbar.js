import { useContext } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CleanIcon from "@mui/icons-material/CleaningServices";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import SummaryIcon from "@mui/icons-material/List";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useStyles } from "./styles";
import OCRContext from "../../context/ocr-context";
import { COLORS } from "../../styles/constants";

const tabList = [
  { label: "UPLOAD", icon: <FileUploadIcon sx={{ mr: 0.5 }} /> },
  { label: "PREPROCESSING", icon: <CleanIcon sx={{ mr: 0.5 }} /> },
  { label: "OCR", icon: <EyeIcon sx={{ mr: 0.5 }} /> },
  { label: "SUMMARY", icon: <SummaryIcon sx={{ mr: 0.5 }} /> },
];

const Tabbar = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleChange = (event, newValue) => {
    ocrCtx.setActivePage(newValue);
  };

  return (
    <Grid container className={classes.rootContainer}>
      <Grid item xs={12} container justifyContent="center" flexWrap="wrap">
        <Tabs
          TabIndicatorProps={{
            style: {
              backgroundColor: COLORS.PRIMARY,
            },
          }}
          className={classes.tabsContainer}
          value={ocrCtx.activePage}
          onChange={handleChange}
          variant="scrollable"
          classes={{ indicator: classes.indicator }}
        >
          {tabList.map((tab, index) => (
            <Tab
              key={index}
              classes={{ selected: classes.tabSelected }}
              sx={{
                maxWidth: "100%",
                mx: { xs: 0, sm: 0.5, md: 1, lg: 2 },
                p: { xs: 0, sm: 0.5, md: 1, lg: 1.5 },
                color: ocrCtx.activePage === index ? "inherit" : "black",
              }}
              label={
                <Typography sx={{ display: "flex" }}>
                  {tab.icon}
                  <span className={classes.text}>{tab.label}</span>
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
