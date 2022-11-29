import { Button, Typography } from "@mui/material";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";
const cv = window.cv;

const UploadCard = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const img = new Image();
    img.onload = () => {
      const mat = cv.imread(img);
      cv.imshow("output", mat);
      mat.delete();
    };
    img.src = URL.createObjectURL(event.target.files[0]);
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2 }}>
          Upload document
        </Typography>
        <div className={classes.input}>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
        <Button
          variant="contained"
          onClick={() => navigate("/preprocessing")}
          sx={{ margin: "20px", px: "10%" }}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default UploadCard;
