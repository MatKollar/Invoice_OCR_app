import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  card: {
    margin: 10,
    cursor: "pointer",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.8)",
    },
    minWidth: 100,
    minHeight: 100,
  },
});
