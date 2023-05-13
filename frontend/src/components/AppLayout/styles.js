import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#B2B2B2",
  },
  contentWrapper: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#B2B2B2",
  },
  contentWrapperExpanded: {
    marginLeft: '0',
  },
});
