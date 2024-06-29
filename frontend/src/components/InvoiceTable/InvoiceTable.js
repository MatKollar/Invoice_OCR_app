import { useState } from "react";

import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import httpRequest from "../../httpRequest";
import ButtonOutlined from "../StyledComponents/ButtonOutlined";
import StyledTextField from "../StyledComponents/StyledTextField";
import { COLORS } from "../../styles/constants";

const columns = [
  { id: "inv_number", label: "Invoice Number", minWidth: 170 },
  { id: "supplier", label: "Supplier", minWidth: 100 },
  { id: "buyer", label: "Buyer", minWidth: 100 },
  { id: "due_date", label: "Due Date", minWidth: 100 },
  { id: "amount", label: "Amount", minWidth: 100 },
];

const InvoiceTable = ({ invoiceData, openSummary, refreshInvoiceData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const rows = [];
  const dataToSearch = [];
  invoiceData.forEach((invoice) => {
    rows.push({
      id: invoice.id,
      inv_number: invoice.invoice_number,
      supplier: invoice.supplier_data.Name,
      buyer: invoice.buyer_data.Name,
      due_date: invoice.due_date,
      amount: invoice.total_price,
    });

    dataToSearch.push({
      id: invoice.id,
      inv_number: invoice.invoice_number,
      due_date: invoice.due_date,
      amount: invoice.total_price,
      bank: invoice.bank,
      iban: invoice.iban,
      var_symbol: invoice.var_symbol,
      supplier: invoice.supplier_data.Name,
      buyer: invoice.buyer_data.Name,
      supplier_ico: invoice.supplier_data.ICO,
      supplier_city: invoice.supplier_data.City,
      supplier_dic: invoice.supplier_data.DIC,
      supplier_PSC: invoice.supplier_data.PSC,
      supplier_street: invoice.supplier_data.Street,
      buyer_ico: invoice.buyer_data.ICO,
      buyer_city: invoice.buyer_data.City,
      buyer_dic: invoice.buyer_data.DIC,
      buyer_PSC: invoice.buyer_data.PSC,
      buyer_street: invoice.buyer_data.Street,
    });
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const openInvoiceSummary = (invoiceRowData) => {
    const invoiceDataSelected = invoiceData.filter(
      (invoice) => invoice.invoice_number === invoiceRowData.inv_number
    );
    openSummary(invoiceDataSelected[0]);
  };

  const filteredRows = dataToSearch.filter((row) => {
    return Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredInvoiceData = filteredRows.map((row) => {
    return {
      id: row.id,
      inv_number: row.inv_number,
      supplier: row.supplier,
      buyer: row.buyer,
      due_date: row.due_date,
      amount: row.amount,
    };
  });

  const handleDeleteConfirmation = async () => {
    try {
      await httpRequest.delete(
        `${process.env.REACT_APP_BACKEND_URL}/delete-invoice`,
        {
          params: {
            id: invoiceToDelete.id,
          },
        }
      );

      enqueueSnackbar("Invoice deleted successfully!", { variant: "success" });
      refreshInvoiceData();
    } catch (error) {
      console.error("Error deleting the invoice:", error.response);
      enqueueSnackbar("Error while deleting invoice", { variant: "error" });
    }

    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const openDeleteDialogHandler = (event, row) => {
    event.stopPropagation();
    setInvoiceToDelete(row);
    setOpenDeleteDialog(true);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 5 }}>
      <StyledTextField
        label="Search"
        variant="outlined"
        size="small"
        value={search}
        onChange={handleSearch}
        style={{ margin: 10 }}
      />
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSortRequest(column.id)}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {column.label}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filteredInvoiceData, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    onClick={() => openInvoiceSummary(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell align="right">
                      <IconButton
                        onClick={(event) => openDeleteDialogHandler(event, row)}
                      >
                        <DeleteIcon sx={{ color: COLORS.PRIMARY }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredInvoiceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
        >
          Delete Invoice
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
          >
            Are you sure you want to delete this invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonOutlined onClick={handleDeleteCancel} color="primary">
            Cancel
          </ButtonOutlined>
          <ButtonOutlined
            onClick={handleDeleteConfirmation}
            color="primary"
            autoFocus
          >
            Yes
          </ButtonOutlined>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InvoiceTable;
