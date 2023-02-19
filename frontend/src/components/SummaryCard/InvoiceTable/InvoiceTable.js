import { useStyles } from "./styles";
import DataTableWide from "../../Table/DataTableWide";

const InvoiceTable = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
      <DataTableWide invoiceData={props.data} />
    </div>
  );
};

export default InvoiceTable;
