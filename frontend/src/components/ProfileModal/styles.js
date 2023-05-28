import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  profile: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  text: {
    width: "60%",
    display: "flex",
    justifyContent: "space-between",
  },

  "@media (max-width:470px)": {
    profile: {
      flexWrap: "wrap",
    },
  },  
});
