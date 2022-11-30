import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Grid, Typography } from "@mui/material";
import { useStyles } from "./styles";
const cv = window.cv;

const PreprocessingCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleGrayScale = () => {
    const mat = cv.imread("output");
    cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow("output", mat);
    mat.delete();
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select preprocessing
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handleGrayScale}
              sx={{ margin: "20px", px: "10%" }}
            >
              Grayscale
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() => ocrCtx.setActivePage(2)}
          sx={{ margin: "5px", px: "10%" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default PreprocessingCard;
