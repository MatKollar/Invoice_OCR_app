import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#919191",
  },
  contentWrapper: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#b0b0b0",
  },
  contentWrapperExpanded: {
    marginLeft: "0",
  },
});
