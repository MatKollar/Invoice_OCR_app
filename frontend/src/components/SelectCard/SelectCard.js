import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";

const SelectCard = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h4" sx={{ pt: 2 }}>
          Upload document
        </Typography>
        <div className={classes.input}>
          <input
            type="file"
            className="form-control"
            //   onChange={(e) => handleImageUpload(e)}
          />
        </div>
        <Button
          variant="contained"
          //   onClick={handleClick}
          sx={{ margin: "20px", px: "50px" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default SelectCard;
