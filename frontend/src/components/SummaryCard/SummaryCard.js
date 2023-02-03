import { useContext, useState } from "react";
import OCRContext from "../../context/ocr-context";
import { TextField, Button } from "@mui/material";
import { useStyles } from "./styles";

const SummaryCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);

  return (
    <>
      <div className={classes.rootContainer}>
        {showText && (
          <TextField
            id="outlined-multiline-static"
            className={classes.textField}
            label="Text from OCR"
            multiline
            fullWidth
            rows={20}
            variant={"filled"}
            defaultValue={ocrCtx.textResult}
          />
        )}

        <Button
          variant="contained"
          onClick={() => setShowText(!showText)}
          sx={{ margin: "5px", px: "10%" }}
        >
          {showText ? "HIDE TEXT" : "SHOW TEXT"}
        </Button>
      </div>
    </>
  );
};

export default SummaryCard;
