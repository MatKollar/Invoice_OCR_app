import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { TextField } from "@mui/material";
import { useStyles } from "./styles";

const SummaryCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  return (
    <>
      <div className={classes.rootContainer}>
        <TextField
          id="outlined-multiline-static"
          className={classes.textField}
          label="Text from OCR"
          multiline
          rows={20}
          variant={"filled"}
          defaultValue={ocrCtx.textResult}
        />
      </div>
    </>
  );
};

export default SummaryCard;
