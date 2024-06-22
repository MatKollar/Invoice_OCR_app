import { makeStyles } from "@mui/styles";
import { COLORS } from "../../styles/constants";

export const useStyles = makeStyles({
  rootContainer: {
    margin: "0 auto",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    marginLeft: "10%",
    marginRight: 70,
    width: "70%",
    height: "100%",
    textAlign: "center",
  },
  tables: {
    width: "90%",
    height: "100%",
  },
  tableContainer: {
    display: "flex",
    marginBottom: 10,
  },
  buttons: {
    display: "flex",
    marginRight: "5%",
  },
  save: {
    marginLeft: "42.5%",
  },
  bar: {
    display: "flex",
    justifyContent: "space-between",
  },
  invoiceContainer: {
    width: "105%",
    backgroundColor: "#f5f5f5",
  },
  invoice: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },

  focused: {
    "& .MuiInput-underline:after": {
      borderBottomColor: COLORS.PRIMARY,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: COLORS.PRIMARY,
    },
  },

  "@media (max-width:570px)": {
    save: {
      marginLeft: "10%",
      marginBottom: "10px",
    },
  },

  "@media (max-width:420px)": {
    buttons: {
      marginRight: "5%",
    },
    table: {
      marginLeft: "-25px",
    },
    tableContainer: {
      marginLeft: "-25px",
    },
    textContainer: {
      marginRight: "10px",
    },
  },

  "@media (max-width:380px)": {
    table: {
      marginRight: "5%",
    },
    tableContainer: {
      marginRight: "5%",
    },
  },
});
