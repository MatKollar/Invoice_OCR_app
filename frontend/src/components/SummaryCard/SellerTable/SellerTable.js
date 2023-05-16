import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";

const SellerTable = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const prevData = useRef(null);

  useEffect(() => {
    if (props.data) {
      if (props.data.supplier_ico && Object.keys(props.data.supplier_data).length === 0) {
        if (
          prevData.current === null ||
          prevData.current.supplier_ico !== props.data.supplier_ico
        ) {
          enqueueSnackbar("No supplier data available from API", {
            variant: "info",
          });
        }
      }
    }

    prevData.current = props.data;
  }, [props.data, enqueueSnackbar]);

  return (
    <div className={classes.table}>
      <DataTable
        data={props.data ? props.data.supplier_data : ""}
        ico={props.data ? props.data.supplier_ico : ""}
        onDataChange={props.onDataChange}
      />
    </div>
  );
};

export default SellerTable;
