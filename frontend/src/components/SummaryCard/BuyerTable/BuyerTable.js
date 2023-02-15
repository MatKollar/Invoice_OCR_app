import { useContext } from "react";
import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";
import OCRContext from "../../../context/ocr-context";

const BuyerTable = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  return (
    <div className={classes.table} >
        <DataTable data={ocrCtx.extractedData ? ocrCtx.extractedData.buyer_data : ""} />
    </div>
  );
};

export default BuyerTable;
