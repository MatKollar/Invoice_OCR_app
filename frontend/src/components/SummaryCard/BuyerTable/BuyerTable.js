import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useStyles } from "./styles";
import DataTable from "../../Table/DataTable";

const BuyerTable = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const prevData = useRef(null);

  useEffect(() => {
    if (props.data) {
      if (props.data.buyer_ico && Object.keys(props.data.buyer_data).length === 0) {
        if (
          prevData.current === null ||
          prevData.current.buyer_ico !== props.data.buyer_ico
        ) {
          enqueueSnackbar("No buyer data available from API", {
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
        data={props.data ? props.data.buyer_data : ""}
        ico={props.data ? props.data.buyer_ico : ""}
        onDataChange={props.onDataChange}
      />
    </div>
  );
};

export default BuyerTable;
