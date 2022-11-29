import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";
const cv = window.cv;

const UploadCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const handleImageUpload = (event) => {
    const img = new Image();
    img.onload = () => {
      const mat = cv.imread(img);
      cv.imshow("output", mat);
      mat.delete();
    };
    img.src = URL.createObjectURL(event.target.files[0]);
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Upload document
        </Typography>
        <div className={classes.input}>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
        <Button
          variant="contained"
          sx={{ margin: "20px", px: "10%" }}
          onClick={() => ocrCtx.setActivePage(1)}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default UploadCard;
