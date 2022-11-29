import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";
const cv = window.cv;

const OCRCard = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Select OCR method
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/summary")}
          sx={{ margin: "20px", px: "10%" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default OCRCard;
