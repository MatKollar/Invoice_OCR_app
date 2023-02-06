import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useStyles } from "./styles";
import TableToolbar from "./TableToolbar";

const Table = () => {
  const [selectedCellParams, setSelectedCellParams] = React.useState(null);
  const [cellModesModel, setCellModesModel] = React.useState({});
  const classes = useStyles();

  const handleCellFocus = React.useCallback((event) => {
    const row = event.currentTarget.parentElement;
    const id = row.dataset.id;
    const field = event.currentTarget.dataset.field;
    setSelectedCellParams({ id, field });
  }, []);

  const cellMode = React.useMemo(() => {
    if (!selectedCellParams) {
      return "view";
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || "view";
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = React.useCallback(
    (params, event) => {
      if (cellMode === "edit") {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode]
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        className={classes.table}
        headerHeight={0}
        hideFooter
        autoHeight
        rows={rows}
        columns={columns}
        onCellKeyDown={handleCellKeyDown}
        cellModesModel={cellModesModel}
        onCellModesModelChange={(model) => setCellModesModel(model)}
        components={{
          Toolbar: TableToolbar,
        }}
        componentsProps={{
          toolbar: {
            cellMode,
            selectedCellParams,
            setSelectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
          cell: {
            onFocus: handleCellFocus,
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

export default Table;

const columns = [{ field: "name", flex: "1", editable: true }];

const rows = [
  {
    id: 1,
    name: "Invoice",
  },
  {
    id: 2,
    name: "Account number",
  },
  {
    id: 3,
    name: "Date",
  },
  {
    id: 4,
    name: "Total price",
  },
];
