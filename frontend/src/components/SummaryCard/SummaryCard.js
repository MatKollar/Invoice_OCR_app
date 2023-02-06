import { useContext, useState } from "react";
import OCRContext from "../../context/ocr-context";
import { TextField, Button } from "@mui/material";
import { useStyles } from "./styles";
import DetailsTable from "./DetailsTable/DetailsTable";
import CompanyTable from "./CompanyTable/CompanyTable";
import ProductsTable from "./ProductsTable/ProductTable";

const SummaryCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);
  const [showText, setShowText] = useState(true);

  return (
    <>
      <div className={classes.rootContainer}>
        <div className={classes.textContainer}>
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

        <div className={classes.tables}>
          <div className={classes.tableContainer}>
            <DetailsTable />
            <CompanyTable />
          </div>
          <ProductsTable />
        </div>
      </div>
    </>
  );
};

export default SummaryCard;
