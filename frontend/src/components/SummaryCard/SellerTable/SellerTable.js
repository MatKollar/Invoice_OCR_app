import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";

const SellerTable = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
      <DataTable data={props.data ? props.data.supplier_data : ""} />
    </div>
  );
};

export default SellerTable;
