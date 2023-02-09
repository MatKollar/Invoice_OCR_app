import { useContext } from "react";
import OCRContext from "../../context/ocr-context";
import { Button, Typography } from "@mui/material";
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
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      image = canvas.toDataURL();
    }
    canvas.remove();
    return image;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file.name);
    if (file.type === "application/pdf") {
      const image = convertPdfToImages(event.target.files[0]);
      image.then(async (image) => {
        const img = new Image();
        img.onload = () => {
          const mat = cv.imread(img);
          cv.imshow("output", mat);
          mat.delete();
        };
        img.src = image;
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        let fileImage = new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        ocrCtx.setOriginalImage(fileImage);
        ocrCtx.setActualImage(fileImage);
      });
    } else {
      const img = new Image();
      img.onload = () => {
        const mat = cv.imread(img);
        cv.imshow("output", mat);
        mat.delete();
      };
      img.src = URL.createObjectURL(event.target.files[0]);
      ocrCtx.setOriginalImage(event.target.files[0]);
      ocrCtx.setActualImage(event.target.files[0]);
    }
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
          sx={{ margin: "20px", px: "10%" }}
          onClick={() => ocrCtx.setActivePage(1)}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default UploadCard;
