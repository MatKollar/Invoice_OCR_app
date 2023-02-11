import { useStyles } from "./styles";
import DataTableWide from "../../Table/DataTableWide";

const InvoiceTable = () => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
        <DataTableWide />
    </div>
  );
};

export default InvoiceTable;
