import { useContext } from "react";
import { Button, Typography } from "@mui/material";
import OCRContext from "../../context/ocr-context";
import { useStyles } from "./styles";
const cv = window.cv;

const UploadCard = () => {
  const classes = useStyles();
  const ocrCtx = useContext(OCRContext);

  const PDFJS = require("pdfjs-dist/webpack");

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertPdfToImages = async (file) => {
    let image;
    const data = await readFileData(file);
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4.8 });
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.width = "100%";
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    image = canvas.toDataURL("image/png", 1.0);
    canvas.remove();
    return image;
  };

  const loadImage = () => {
    const img = new Image();
    img.onload = () => {
      const mat = cv.imread(img);
      cv.imshow("output", mat);
      mat.delete();
    };
    return img;
  };

  const saveImage = (file) => {
    ocrCtx.setOriginalImage(file);
    ocrCtx.setActualImage(file);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    ocrCtx.setFile(file);
    if (file.type === "application/pdf") {
      const image = convertPdfToImages(file);
      image.then(async (image) => {
        const img = loadImage();
        img.src = image;
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        let fileImage = new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        saveImage(fileImage);
      });
    } else {
      const img = loadImage();
      img.src = URL.createObjectURL(file);
      saveImage(file);
    }
  };

  return (
    <>
      <div className={classes.rootContainer}>
        <Typography variant="h5" sx={{ pt: 2, fontFamily: "Oxanium, cursive" }}>
          Upload Document
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
          sx={{
            margin: "20px",
            px: "10%",
            fontFamily: "Oxanium, cursive",
            backgroundColor: "#854de0",
            "&:hover": {
              backgroundColor: "#6336ab",
            },
          }}
          onClick={() => ocrCtx.setActivePage(1)}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default UploadCard;
