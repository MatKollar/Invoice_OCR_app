import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  rootContainer: {
    position: "relative",
    color: "white",
    backgroundColor: "#222222",
    textAlign: "center",
    width: "250px",
    transition: "width 0.3s ease-in-out",
  },
  rootContainerCollapsed: {
    width: "0",
  },
  closeContainer: {
    textAlign: "right",
  },
  linkContainer: {
    marginTop: 10,
  },
  linkItem: {
    marginTop: 20,
  },
  link: {
    color: "white",
  },
  closeButton: {
    textAlign: "right",
    color: "white",
  },
});
