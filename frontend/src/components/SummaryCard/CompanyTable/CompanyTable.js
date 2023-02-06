import { useStyles } from "./styles";
import Table from "../../Table/Table";

const CompanyTable = () => {
  const classes = useStyles();

  return (
    <div className={classes.table} >
        <Table />
    </div>
  );
};

export default CompanyTable;
