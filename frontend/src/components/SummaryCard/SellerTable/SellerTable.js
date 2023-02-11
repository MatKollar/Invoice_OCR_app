import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";

const SellerTable = () => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
        <DataTable />
    </div>
  );
};

export default SellerTable;
