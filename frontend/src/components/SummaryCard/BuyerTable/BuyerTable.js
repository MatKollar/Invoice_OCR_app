import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";

const BuyerTable = () => {
  const classes = useStyles();

  return (
    <div className={classes.table} >
        <DataTable />
    </div>
  );
};

export default BuyerTable;
